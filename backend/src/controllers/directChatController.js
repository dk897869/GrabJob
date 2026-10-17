const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const Connection = require('../models/Connection');

/**
 * Get all conversations for the authenticated user
 */
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate('participants', 'name email avatarUrl headline company role')
      .sort({ updatedAt: -1 });

    const formattedConversations = conversations.map((conv) => {
      const otherParticipant = conv.participants.find(
        (p) => p._id.toString() !== userId.toString()
      );
      const unread = conv.unreadCounts?.get(userId.toString()) || 0;

      return {
        _id: conv._id,
        participant: otherParticipant || null,
        lastMessage: conv.lastMessage,
        unreadCount: unread,
        updatedAt: conv.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      conversations: formattedConversations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get message history for a specific conversation or participant
 */
const getMessages = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    }).populate('participants', 'name email avatarUrl headline company');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied.',
      });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatarUrl headline')
      .populate('recipient', 'name avatarUrl headline')
      .sort({ createdAt: 1 });

    // Mark unread messages sent to current user as read
    await Message.updateMany(
      {
        conversation: conversationId,
        recipient: userId,
        isRead: false,
      },
      {
        $set: { isRead: true, readAt: new Date() },
      }
    );

    // Reset unread counter for current user in conversation
    if (conversation.unreadCounts) {
      conversation.unreadCounts.set(userId.toString(), 0);
      await conversation.save();
    }

    const otherParticipant = conversation.participants.find(
      (p) => p._id.toString() !== userId.toString()
    );

    return res.status(200).json({
      success: true,
      conversationId: conversation._id,
      participant: otherParticipant,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send a message (text and/or attachments) to a recipient or conversation
 */
const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const { recipientId, conversationId, text, attachments } = req.body;

    if (!text && (!attachments || attachments.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.',
      });
    }

    let targetRecipientId = recipientId;
    let targetConversation = null;

    if (conversationId) {
      targetConversation = await Conversation.findOne({
        _id: conversationId,
        participants: senderId,
      });

      if (!targetConversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found.',
        });
      }

      targetRecipientId = targetConversation.participants
        .find((p) => p.toString() !== senderId.toString())
        ?.toString();
    }

    if (!targetRecipientId) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID is required.',
      });
    }

    // Check if recipient exists
    const recipient = await User.findById(targetRecipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found.',
      });
    }

    // Check blocking rules
    const sender = await User.findById(senderId);
    if (
      sender.blockedUsers?.some((id) => id.toString() === targetRecipientId.toString()) ||
      recipient.blockedUsers?.some((id) => id.toString() === senderId.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'You cannot message this user.',
      });
    }

    // Find or create conversation
    if (!targetConversation) {
      targetConversation = await Conversation.findOne({
        participants: { $all: [senderId, targetRecipientId], $size: 2 },
      });

      if (!targetConversation) {
        targetConversation = await Conversation.create({
          participants: [senderId, targetRecipientId],
          unreadCounts: new Map([
            [senderId.toString(), 0],
            [targetRecipientId.toString(), 0],
          ]),
        });
      }
    }

    // Create the message
    const message = await Message.create({
      conversation: targetConversation._id,
      sender: senderId,
      recipient: targetRecipientId,
      text: text || '',
      attachments: attachments || [],
    });

    // Update conversation last message & unread count
    const lastSnippet = text
      ? text.slice(0, 80)
      : (attachments?.[0]?.fileName ? `Sent file: ${attachments[0].fileName}` : 'Attachment');

    targetConversation.lastMessage = {
      text: lastSnippet,
      sender: senderId,
      createdAt: new Date(),
    };

    const currentUnread = targetConversation.unreadCounts?.get(targetRecipientId.toString()) || 0;
    if (!targetConversation.unreadCounts) {
      targetConversation.unreadCounts = new Map();
    }
    targetConversation.unreadCounts.set(targetRecipientId.toString(), currentUnread + 1);
    await targetConversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatarUrl headline')
      .populate('recipient', 'name avatarUrl headline');

    return res.status(201).json({
      success: true,
      message: populatedMessage,
      conversationId: targetConversation._id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload chat attachment (CV, PDF, image, document)
 */
const uploadAttachment = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.',
      });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      attachment: {
        fileUrl,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get or initiate conversation with a specific user
 */
const getOrCreateConversation = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const { targetUserId } = req.params;

    if (senderId.toString() === targetUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot start a conversation with yourself.',
      });
    }

    const targetUser = await User.findById(targetUserId).select('name email avatarUrl headline company role');
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found.',
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, targetUserId], $size: 2 },
    }).populate('participants', 'name email avatarUrl headline company role');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, targetUserId],
        unreadCounts: new Map([
          [senderId.toString(), 0],
          [targetUserId.toString(), 0],
        ]),
      });
      conversation = await Conversation.findById(conversation._id).populate(
        'participants',
        'name email avatarUrl headline company role'
      );
    }

    return res.status(200).json({
      success: true,
      conversation: {
        _id: conversation._id,
        participant: targetUser,
        lastMessage: conversation.lastMessage,
        unreadCount: conversation.unreadCounts?.get(senderId.toString()) || 0,
        updatedAt: conversation.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  uploadAttachment,
  getOrCreateConversation,
};

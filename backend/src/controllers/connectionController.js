const Connection = require('../models/Connection');
const User = require('../models/User');

/**
 * Send Connection Request
 */
const sendConnectionRequest = async (req, res, next) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    if (String(targetUserId) === String(currentUserId)) {
      return res.status(400).json({ success: false, message: 'You cannot connect with yourself.' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Target user not found.' });
    }

    // Check if user is blocked
    if (req.user.blockedUsers?.includes(targetUserId) || targetUser.blockedUsers?.includes(currentUserId)) {
      return res.status(403).json({ success: false, message: 'Unable to connect with this user.' });
    }

    // Check existing connection
    const existing = await Connection.findOne({
      $or: [
        { requester: currentUserId, recipient: targetUserId },
        { requester: targetUserId, recipient: currentUserId },
      ],
    });

    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(400).json({ success: false, message: 'Already connected.' });
      }
      if (existing.status === 'pending') {
        return res.status(400).json({ success: false, message: 'Connection request is already pending.' });
      }
      if (existing.status === 'declined') {
        existing.status = 'pending';
        existing.requester = currentUserId;
        existing.recipient = targetUserId;
        await existing.save();
        return res.status(200).json({ success: true, message: 'Connection request sent.', data: existing });
      }
    }

    const newConnection = await Connection.create({
      requester: currentUserId,
      recipient: targetUserId,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Connection request sent successfully!',
      data: newConnection,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Accept Connection Request
 */
const acceptConnectionRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const connection = await Connection.findOne({
      _id: id,
      recipient: req.user._id,
      status: 'pending',
    });

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Pending connection request not found.' });
    }

    connection.status = 'accepted';
    await connection.save();

    // Increment connections count for both users
    await Promise.all([
      User.findByIdAndUpdate(connection.requester, { $inc: { connectionsCount: 1 } }),
      User.findByIdAndUpdate(connection.recipient, { $inc: { connectionsCount: 1 } }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Connection request accepted!',
      data: connection,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Decline Connection Request
 */
const declineConnectionRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const connection = await Connection.findOne({
      _id: id,
      recipient: req.user._id,
      status: 'pending',
    });

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Pending connection request not found.' });
    }

    connection.status = 'declined';
    await connection.save();

    return res.status(200).json({
      success: true,
      message: 'Connection request ignored.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Block User
 */
const blockUser = async (req, res, next) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { blockedUsers: targetUserId },
    });

    // Update connection status if any
    const connection = await Connection.findOne({
      $or: [
        { requester: currentUserId, recipient: targetUserId },
        { requester: targetUserId, recipient: currentUserId },
      ],
    });

    if (connection) {
      if (connection.status === 'accepted') {
        await Promise.all([
          User.findByIdAndUpdate(currentUserId, { $inc: { connectionsCount: -1 } }),
          User.findByIdAndUpdate(targetUserId, { $inc: { connectionsCount: -1 } }),
        ]);
      }
      connection.status = 'blocked';
      connection.blockedBy = currentUserId;
      await connection.save();
    }

    return res.status(200).json({
      success: true,
      message: 'User has been blocked.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unblock User
 */
const unblockUser = async (req, res, next) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { blockedUsers: targetUserId },
    });

    await Connection.findOneAndDelete({
      $or: [
        { requester: currentUserId, recipient: targetUserId, status: 'blocked' },
        { requester: targetUserId, recipient: currentUserId, status: 'blocked' },
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'User unblocked.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove Connection
 */
const removeConnection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const connection = await Connection.findOne({
      _id: id,
      $or: [{ requester: req.user._id }, { recipient: req.user._id }],
      status: 'accepted',
    });

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection not found.' });
    }

    await Connection.findByIdAndDelete(connection._id);

    // Decrement connections counts
    await Promise.all([
      User.findByIdAndUpdate(connection.requester, { $inc: { connectionsCount: -1 } }),
      User.findByIdAndUpdate(connection.recipient, { $inc: { connectionsCount: -1 } }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Connection removed.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get My Connections (Accepted)
 */
const getMyConnections = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const connections = await Connection.find({
      $or: [{ requester: currentUserId }, { recipient: currentUserId }],
      status: 'accepted',
    })
      .populate('requester', 'name email avatar headline city state currentRole company connectionsCount')
      .populate('recipient', 'name email avatar headline city state currentRole company connectionsCount')
      .sort({ updatedAt: -1 });

    const formatted = connections.map((c) => {
      const isRequester = String(c.requester._id) === String(currentUserId);
      const otherUser = isRequester ? c.recipient : c.requester;
      return {
        connectionId: c._id,
        user: otherUser,
        connectedSince: c.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      data: formatted,
      count: formatted.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Pending Requests (Received & Sent)
 */
const getPendingRequests = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    const [received, sent] = await Promise.all([
      Connection.find({ recipient: currentUserId, status: 'pending' })
        .populate('requester', 'name email avatar headline city state currentRole company')
        .sort({ createdAt: -1 }),
      Connection.find({ requester: currentUserId, status: 'pending' })
        .populate('recipient', 'name email avatar headline city state currentRole company')
        .sort({ createdAt: -1 }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        received,
        sent,
        totalPending: received.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get "People You May Know" Suggestions
 */
const getSuggestedConnections = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    // Find all IDs where connection already exists or is pending/blocked
    const existingConnections = await Connection.find({
      $or: [{ requester: currentUserId }, { recipient: currentUserId }],
    });

    const excludedIds = [currentUserId];
    existingConnections.forEach((c) => {
      excludedIds.push(String(c.requester));
      excludedIds.push(String(c.recipient));
    });

    // Also exclude blocked users
    if (req.user.blockedUsers) {
      req.user.blockedUsers.forEach((id) => excludedIds.push(String(id)));
    }

    // Find suggested users
    const suggestions = await User.find({
      _id: { $nin: excludedIds },
    })
      .select('name email avatar headline city state currentRole company skills connectionsCount')
      .limit(15);

    return res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check connection status with a specific user
 */
const getConnectionStatusWithUser = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { userId } = req.params;

    if (String(currentUserId) === String(userId)) {
      return res.status(200).json({
        success: true,
        status: 'self',
      });
    }

    const connection = await Connection.findOne({
      $or: [
        { requester: currentUserId, recipient: userId },
        { requester: userId, recipient: currentUserId },
      ],
    });

    if (!connection) {
      return res.status(200).json({
        success: true,
        status: 'none',
      });
    }

    return res.status(200).json({
      success: true,
      status: connection.status,
      connectionId: connection._id,
      isRequester: String(connection.requester) === String(currentUserId),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  blockUser,
  unblockUser,
  removeConnection,
  getMyConnections,
  getPendingRequests,
  getSuggestedConnections,
  getConnectionStatusWithUser,
};


import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Send,
  Paperclip,
  FileText,
  Download,
  Search,
  MoreVertical,
  ShieldAlert,
  User,
  CheckCheck,
  Clock,
  X,
  File,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import messageService from '../services/messageService';
import networkService from '../services/networkService';

export default function Messages() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('userId');
  const { user: currentUser } = useAuthStore();

  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // 1. Fetch conversations list
  const {
    data: conversationsData,
    isLoading: loadingConversations,
    refetch: refetchConversations,
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations(),
    refetchInterval: 6000, // Refresh every 6s for new incoming messages
  });

  const conversationsList = conversationsData?.conversations || [];

  // 2. If targetUserId is passed in URL query, load or create conversation with that user
  useEffect(() => {
    if (targetUserId) {
      messageService
        .getOrCreateConversation(targetUserId)
        .then((res) => {
          if (res.conversation) {
            setActiveConversationId(res.conversation._id);
            refetchConversations();
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || 'Could not load conversation');
        });
    } else if (conversationsList.length > 0 && !activeConversationId) {
      setActiveConversationId(conversationsList[0]._id);
    }
  }, [targetUserId, conversationsList.length]);

  // 3. Fetch messages for active conversation
  const {
    data: messagesData,
    isLoading: loadingMessages,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ['messages', activeConversationId],
    queryFn: () => (activeConversationId ? messageService.getMessages(activeConversationId) : null),
    enabled: Boolean(activeConversationId),
    refetchInterval: 3000, // Refresh every 3s when chat is open
  });

  const currentMessages = messagesData?.messages || [];
  const currentParticipant = messagesData?.participant;

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length]);

  // Handle file attachment selection & upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    try {
      setUploadingFile(true);
      const res = await messageService.uploadAttachment(file);
      if (res.success && res.attachment) {
        setSelectedAttachment(res.attachment);
        toast.success(`Attached: ${file.name}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Attachment upload failed');
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: (payload) => messageService.sendMessage(payload),
    onSuccess: () => {
      setMessageText('');
      setSelectedAttachment(null);
      refetchMessages();
      refetchConversations();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to send message');
    },
  });

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!messageText.trim() && !selectedAttachment) return;
    if (!activeConversationId && !targetUserId) return;

    sendMutation.mutate({
      conversationId: activeConversationId,
      recipientId: currentParticipant?._id || targetUserId,
      text: messageText.trim(),
      attachments: selectedAttachment ? [selectedAttachment] : [],
    });
  };

  const handleBlockUser = async () => {
    if (!currentParticipant) return;
    if (window.confirm(`Are you sure you want to block ${currentParticipant.name}?`)) {
      try {
        await networkService.blockUser(currentParticipant._id);
        toast.success(`${currentParticipant.name} has been blocked`);
        setShowOptionsDropdown(false);
        setActiveConversationId(null);
        refetchConversations();
      } catch (err) {
        toast.error('Failed to block user');
      }
    }
  };

  const filteredConversations = conversationsList.filter((conv) => {
    const name = conv.participant?.name?.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    return name.includes(q);
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '88vh', padding: '24px 0 40px' }}>
      <div className="container" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 16px' }}>
        
        {/* Container with rounded border, card shadow */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            display: 'grid',
            gridTemplateColumns: '340px 1fr',
            height: '78vh',
            minHeight: '620px',
            overflow: 'hidden',
          }}
        >
          {/* ================= LEFT CONVERSATION LIST ================= */}
          <div
            style={{
              borderRight: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff',
            }}
          >
            {/* Conversations Header */}
            <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                  Messaging
                </h2>
                <Link
                  to="/network"
                  style={{
                    fontSize: '0.82rem',
                    color: '#2563eb',
                    fontWeight: '600',
                    textDecoration: 'none',
                  }}
                >
                  Network
                </Link>
              </div>

              {/* Search box */}
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Conversation Items List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loadingConversations ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
                  Loading chats...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 12px' }}>
                    No conversations yet.
                  </p>
                  <Link
                    to="/network"
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      textDecoration: 'none',
                    }}
                  >
                    Connect with people
                  </Link>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv._id === activeConversationId;
                  const participant = conv.participant;

                  return (
                    <div
                      key={conv._id}
                      onClick={() => setActiveConversationId(conv._id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        borderBottom: '1px solid #f8fafc',
                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                        borderLeft: isSelected ? '4px solid #2563eb' : '4px solid transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.1s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '1.1rem',
                          flexShrink: 0,
                        }}
                      >
                        {participant?.name?.charAt(0)?.toUpperCase() || 'P'}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                          <h4
                            style={{
                              margin: 0,
                              fontSize: '0.92rem',
                              fontWeight: isSelected ? '700' : '600',
                              color: '#0f172a',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {participant?.name || 'User'}
                          </h4>
                          {conv.updatedAt && (
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                              {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>

                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.8rem',
                            color: '#64748b',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {conv.lastMessage?.text || 'Sent an attachment'}
                        </p>
                      </div>

                      {conv.unreadCount > 0 && (
                        <span
                          style={{
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            borderRadius: '10px',
                            padding: '2px 7px',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                          }}
                        >
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ================= RIGHT CHAT WINDOW ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fafaf9' }}>
            {activeConversationId && currentParticipant ? (
              <>
                {/* Chat Top Bar */}
                <div
                  style={{
                    padding: '12px 20px',
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: '#2563eb',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '1rem',
                      }}
                    >
                      {currentParticipant.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>
                        {currentParticipant.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                        {currentParticipant.headline || `${currentParticipant.company || 'Company'} • Member`}
                      </p>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                    <Link
                      to={`/profile/${currentParticipant._id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        color: '#475569',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <User size={14} /> View Profile
                    </Link>

                    <button
                      onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '6px',
                        cursor: 'pointer',
                        color: '#64748b',
                        borderRadius: '4px',
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {showOptionsDropdown && (
                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '36px',
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          width: '160px',
                          zIndex: 10,
                          overflow: 'hidden',
                        }}
                      >
                        <button
                          onClick={handleBlockUser}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            background: 'none',
                            border: 'none',
                            padding: '10px 14px',
                            fontSize: '0.85rem',
                            color: '#dc2626',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <ShieldAlert size={15} /> Block User
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages Body */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {loadingMessages ? (
                    <div style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>
                      Loading chat messages...
                    </div>
                  ) : currentMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', margin: 'auto', padding: '20px' }}>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 6px' }}>
                        This is the beginning of your conversation with {currentParticipant.name}.
                      </p>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        Say hi, introduce yourself, or share your resume / CV document!
                      </span>
                    </div>
                  ) : (
                    currentMessages.map((msg) => {
                      const isMe =
                        msg.sender?._id?.toString() === currentUser?._id?.toString() ||
                        msg.sender?.toString() === currentUser?._id?.toString();

                      return (
                        <div
                          key={msg._id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isMe ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <div
                            style={{
                              maxWidth: '70%',
                              padding: '12px 16px',
                              borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                              backgroundColor: isMe ? '#2563eb' : '#ffffff',
                              color: isMe ? '#ffffff' : '#0f172a',
                              border: isMe ? 'none' : '1px solid #e2e8f0',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            }}
                          >
                            {/* Message text */}
                            {msg.text && (
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: '0.92rem',
                                  lineHeight: 1.45,
                                  whiteSpace: 'pre-wrap',
                                }}
                              >
                                {msg.text}
                              </p>
                            )}

                            {/* Message attachments (CV, PDF, Docx, etc.) */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div style={{ marginTop: msg.text ? '10px' : '0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {msg.attachments.map((att, i) => (
                                  <a
                                    key={i}
                                    href={att.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={att.fileName}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      padding: '8px 12px',
                                      borderRadius: '8px',
                                      backgroundColor: isMe ? 'rgba(255,255,255,0.15)' : '#f1f5f9',
                                      color: isMe ? '#ffffff' : '#1e293b',
                                      textDecoration: 'none',
                                      fontSize: '0.84rem',
                                    }}
                                  >
                                    <FileText size={20} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <p style={{ margin: 0, fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {att.fileName}
                                      </p>
                                      {att.fileSize && (
                                        <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>
                                          {(att.fileSize / 1024).toFixed(0)} KB
                                        </span>
                                      )}
                                    </div>
                                    <Download size={16} />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Timestamp and read check */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginTop: '3px',
                              fontSize: '0.72rem',
                              color: '#94a3b8',
                            }}
                          >
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <CheckCheck size={14} color={msg.isRead ? '#2563eb' : '#94a3b8'} />}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Pending Attachment Preview Bar */}
                {selectedAttachment && (
                  <div
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#eff6ff',
                      borderTop: '1px solid #bfdbfe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.84rem',
                      color: '#1e40af',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} />
                      <span>Ready to send: <strong>{selectedAttachment.fileName}</strong></span>
                    </div>
                    <button
                      onClick={() => setSelectedAttachment(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#1e40af',
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  style={{
                    padding: '14px 20px',
                    borderTop: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                    title="Attach CV / PDF or File"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Paperclip size={20} />
                  </button>

                  <input
                    type="text"
                    placeholder="Write a message or attach your CV..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />

                  <button
                    type="submit"
                    disabled={sendMutation.isPending || (!messageText.trim() && !selectedAttachment)}
                    style={{
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.9rem',
                      opacity: !messageText.trim() && !selectedAttachment ? 0.6 : 1,
                    }}
                  >
                    <Send size={16} /> Send
                  </button>
                </form>
              </>
            ) : (
              <div style={{ margin: 'auto', textAlign: 'center', padding: '40px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <Send size={28} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>
                  Your Direct Messages
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: '360px', margin: '0 auto 20px' }}>
                  Select a chat from the left or connect with candidates, hiring managers, and walk-in coordinators.
                </p>
                <Link
                  to="/network"
                  style={{
                    padding: '8px 18px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '0.86rem',
                    textDecoration: 'none',
                  }}
                >
                  Open Network
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

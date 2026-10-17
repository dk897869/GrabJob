import api from './api';

export const messageService = {
  getConversations: async () => {
    const res = await api.get('/messages/conversations');
    return res.data;
  },

  getOrCreateConversation: async (targetUserId) => {
    const res = await api.get(`/messages/conversations/user/${targetUserId}`);
    return res.data;
  },

  getMessages: async (conversationId) => {
    const res = await api.get(`/messages/conversations/${conversationId}/messages`);
    return res.data;
  },

  sendMessage: async ({ recipientId, conversationId, text, attachments }) => {
    const res = await api.post('/messages/send', {
      recipientId,
      conversationId,
      text,
      attachments,
    });
    return res.data;
  },

  uploadAttachment: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/messages/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

export default messageService;

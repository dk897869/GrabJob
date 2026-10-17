import api from './api';

export const networkService = {
  getMyConnections: async () => {
    const res = await api.get('/connections');
    return res.data;
  },

  getPendingRequests: async () => {
    const res = await api.get('/connections/pending');
    return res.data;
  },

  getSuggestedConnections: async () => {
    const res = await api.get('/connections/suggestions');
    return res.data;
  },

  getConnectionStatus: async (userId) => {
    const res = await api.get(`/connections/status/${userId}`);
    return res.data;
  },

  sendConnectionRequest: async (recipientId, note = '') => {
    const res = await api.post(`/connections/request/${recipientId}`, { note });
    return res.data;
  },

  acceptConnectionRequest: async (connectionId) => {
    const res = await api.post(`/connections/accept/${connectionId}`);
    return res.data;
  },

  declineConnectionRequest: async (connectionId) => {
    const res = await api.post(`/connections/decline/${connectionId}`);
    return res.data;
  },

  removeConnection: async (connectionId) => {
    const res = await api.delete(`/connections/${connectionId}`);
    return res.data;
  },

  blockUser: async (userId) => {
    const res = await api.post(`/connections/block/${userId}`);
    return res.data;
  },

  unblockUser: async (userId) => {
    const res = await api.post(`/connections/unblock/${userId}`);
    return res.data;
  },

  getUserProfile: async (userId) => {
    const res = await api.get(`/auth/users/${userId}`);
    return res.data;
  },
};

export default networkService;

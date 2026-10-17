import api from './api';

export const syncService = {
  getSyncStatus: async () => {
    const res = await api.get('/sync/status');
    return res.data;
  },

  triggerSync: async () => {
    const res = await api.post('/sync/trigger');
    return res.data;
  },
};

export default syncService;

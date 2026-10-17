import api from './api';

export const applicationService = {
  getMyApplications: async () => {
    const { data } = await api.get('/applications/my');
    return data;
  },

  getApplicationById: async (id) => {
    const { data } = await api.get(`/applications/${id}`);
    return data;
  },
};

import api from './api';

export const jobService = {
  getJobs: async (params) => {
    const { data } = await api.get('/jobs', { params });
    return data;
  },

  getJobById: async (id) => {
    const { data } = await api.get(`/jobs/${id}`);
    return data;
  },

  getNearbyJobs: async (params) => {
    const { data } = await api.get('/jobs/nearby', { params });
    return data;
  },

  getWalkinJobs: async (params) => {
    const { data } = await api.get('/jobs/walkin', { params });
    return data;
  },

  applyToJob: async (id, payload = {}) => {
    const { data } = await api.post(`/jobs/${id}/apply`, payload);
    return data;
  },

  saveJob: async (id) => {
    const { data } = await api.post(`/jobs/${id}/save`);
    return data;
  },

  unsaveJob: async (id) => {
    const { data } = await api.delete(`/jobs/${id}/save`);
    return data;
  },

  getSavedJobs: async () => {
    const { data } = await api.get('/jobs/saved');
    return data;
  },
};

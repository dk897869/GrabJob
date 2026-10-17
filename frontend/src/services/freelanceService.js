import api from './api';

export const freelanceService = {
  getFreelanceJobs: async (params) => {
    const { data } = await api.get('/freelance', { params });
    return data;
  },

  getFreelanceJobById: async (id) => {
    const { data } = await api.get(`/freelance/${id}`);
    return data;
  },
};

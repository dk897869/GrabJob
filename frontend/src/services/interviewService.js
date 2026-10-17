import api from './api';

export const interviewService = {
  requestInterview: async ({ jobId, paymentId, notes }) => {
    const { data } = await api.post('/interviews/request', { jobId, paymentId, notes });
    return data;
  },

  getMyInterviews: async () => {
    const { data } = await api.get('/interviews/my');
    return data;
  },

  getInterviewById: async (id) => {
    const { data } = await api.get(`/interviews/${id}`);
    return data;
  },

  schedulePracticeInterview: async (payload) => {
    const { data } = await api.post('/interviews/schedule-practice', payload);
    return data;
  },

  getDomainQuestions: async (domain) => {
    const { data } = await api.get(`/interviews/questions?domain=${encodeURIComponent(domain)}`);
    return data;
  },
};

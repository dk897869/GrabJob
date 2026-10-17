import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const { data } = await api.get('/admin/dashboard');
    return data;
  },

  getUsers: async (params) => {
    const { data } = await api.get('/admin/users', { params });
    return data;
  },

  updateUserRole: async (id, role) => {
    const { data } = await api.patch(`/admin/users/${id}/role`, { role });
    return data;
  },

  createJob: async (jobData) => {
    const { data } = await api.post('/admin/jobs', jobData);
    return data;
  },

  updateJob: async (id, jobData) => {
    const { data } = await api.patch(`/admin/jobs/${id}`, jobData);
    return data;
  },

  deleteJob: async (id) => {
    const { data } = await api.delete(`/admin/jobs/${id}`);
    return data;
  },

  getPayments: async (params) => {
    const { data } = await api.get('/admin/payments', { params });
    return data;
  },

  verifyPayment: async (id, payload) => {
    const { data } = await api.patch(`/admin/payments/${id}/verify`, payload);
    return data;
  },

  getInterviews: async (params) => {
    const { data } = await api.get('/admin/interviews', { params });
    return data;
  },

  scheduleInterview: async (id, scheduleData) => {
    const { data } = await api.post(`/admin/interviews/${id}/schedule`, scheduleData);
    return data;
  },

  getResumeOrders: async (params) => {
    const { data } = await api.get('/admin/resumes', { params });
    return data;
  },

  verifyResumePayment: async (id, payload) => {
    const { data } = await api.patch(`/admin/resumes/${id}/verify-payment`, payload);
    return data;
  },

  getJobSources: async () => {
    const { data } = await api.get('/admin/job-sources');
    return data;
  },

  createJobSource: async (sourceData) => {
    const { data } = await api.post('/admin/job-sources', sourceData);
    return data;
  },

  getEmailLogs: async () => {
    const { data } = await api.get('/admin/email-logs');
    return data;
  },

  getAuditLogs: async () => {
    const { data } = await api.get('/admin/audit-logs');
    return data;
  },
};

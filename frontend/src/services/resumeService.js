import api from './api';

export const resumeService = {
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    const { data } = await api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  matchJd: async ({ resumeId, jobDescription, targetJobTitle }) => {
    const { data } = await api.post('/resumes/match-jd', { resumeId, jobDescription, targetJobTitle });
    return data;
  },

  submitManualPayment: async ({ resumeId, utrNumber, screenshotFile }) => {
    const formData = new FormData();
    if (resumeId) formData.append('resumeId', resumeId);
    formData.append('utrNumber', utrNumber);
    if (screenshotFile) {
      formData.append('screenshot', screenshotFile);
    }
    const { data } = await api.post('/resumes/submit-manual-payment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  analyzeResume: async ({ resumeId, jobId, customizedData }) => {
    const { data } = await api.post('/resumes/analyze', { resumeId, jobId, customizedData });
    return data;
  },

  generateResume: async ({ resumeId, paymentId, customizedData }) => {
    const { data } = await api.post('/resumes/generate', { resumeId, paymentId, customizedData });
    return data;
  },

  getMyResumes: async () => {
    const { data } = await api.get('/resumes/my');
    return data;
  },

  getResumeById: async (id) => {
    const { data } = await api.get(`/resumes/${id}`);
    return data;
  },
};

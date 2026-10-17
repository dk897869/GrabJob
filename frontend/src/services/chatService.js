import api from './api';

export const chatService = {
  sendMessage: async ({ messages, jobId }) => {
    const { data } = await api.post('/chat', { messages, jobId });
    return data;
  },

  getSuggestedPrompts: async () => {
    const { data } = await api.get('/chat/prompts');
    return data;
  },
};

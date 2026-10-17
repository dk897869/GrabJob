import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('grabjob_token') || null,
  isAuthenticated: !!localStorage.getItem('grabjob_token'),
  isLoading: true,
  error: null,

  // Initialize and check current logged in user
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get('/auth/me');
      if (data.success && data.user) {
        set({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch {
      localStorage.removeItem('grabjob_token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post('/auth/login', credentials);
      if (data.token) {
        localStorage.setItem('grabjob_token', data.token);
      }
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg, isLoading: false });
      return { success: false, message: msg };
    }
  },

  register: async (formData) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post('/auth/register', formData);
      if (data.token) {
        localStorage.setItem('grabjob_token', data.token);
      }
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      set({ error: msg, isLoading: false });
      return { success: false, message: msg };
    }
  },

  googleLogin: async (credential) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post('/auth/google', { credential });
      if (data.token) {
        localStorage.setItem('grabjob_token', data.token);
      }
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Google login failed';
      set({ error: msg, isLoading: false });
      return { success: false, message: msg };
    }
  },

  updateProfile: async (updatedData) => {
    try {
      const { data } = await api.patch('/auth/profile', updatedData);
      set({ user: data.user });
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Update failed' };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore
    } finally {
      localStorage.removeItem('grabjob_token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },
}));

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
    checkAuth,
  } = useAuthStore();

  useEffect(() => {
    if (!user && localStorage.getItem('grabjob_token')) {
      checkAuth();
    }
  }, [user, checkAuth]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff' || user?.role === 'admin',
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
    checkAuth,
  };
};

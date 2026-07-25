import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout, accessToken } = useAuthStore();

  return {
    user,
    isAuthenticated,
    login,
    logout,
    accessToken,
  };
};

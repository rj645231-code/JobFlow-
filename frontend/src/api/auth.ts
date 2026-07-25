import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { useAuthStore } from '../store/authStore';
import { LoginRequest, RegisterRequest, TokenResponse, User } from '../types';

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);
  
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const { data } = await apiClient.post<{ user: User; token: TokenResponse }>('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      login(data.user, data.token.accessToken, data.token.refreshToken);
    },
  });
};

export const useRegister = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const { data } = await apiClient.post<{ user: User; token: TokenResponse }>('/auth/register', userData);
      return data;
    },
    onSuccess: (data) => {
      login(data.user, data.token.accessToken, data.token.refreshToken);
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSettled: () => {
      logout();
      queryClient.clear();
      window.location.href = '/login';
    },
  });
};

export const useCurrentUser = () => {
  const { isAuthenticated, updateUser } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await apiClient.get<User>('/auth/me');
      updateUser(data);
      return data;
    },
    enabled: isAuthenticated,
  });
};

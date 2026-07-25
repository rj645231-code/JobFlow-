import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { Company, PaginatedResponse } from '../types';

export const useCompanies = (page: number = 1, pageSize: number = 20, search?: string) => {
  return useQuery({
    queryKey: ['companies', { page, pageSize, search }],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Company>>('/companies', {
        params: { page, pageSize, search },
      });
      return data;
    },
  });
};

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Company>(`/companies/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (company: Partial<Company>) => {
      const { data } = await apiClient.post<Company>('/companies', company);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Company> & { id: string }) => {
      const { data } = await apiClient.put<Company>(`/companies/${id}`, updateData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['company', data.id] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/companies/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.removeQueries({ queryKey: ['company', id] });
    },
  });
};

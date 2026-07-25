import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { Recruiter, PaginatedResponse } from '../types';

export const useRecruiters = (page: number = 1, pageSize: number = 20, search?: string, companyId?: string) => {
  return useQuery({
    queryKey: ['recruiters', { page, pageSize, search, companyId }],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Recruiter>>('/recruiters', {
        params: { page, pageSize, search, companyId },
      });
      return data;
    },
  });
};

export const useRecruiter = (id: string) => {
  return useQuery({
    queryKey: ['recruiter', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Recruiter>(`/recruiters/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateRecruiter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (recruiter: Partial<Recruiter>) => {
      const { data } = await apiClient.post<Recruiter>('/recruiters', recruiter);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiters'] });
    },
  });
};

export const useUpdateRecruiter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Recruiter> & { id: string }) => {
      const { data } = await apiClient.put<Recruiter>(`/recruiters/${id}`, updateData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', data.id] });
      queryClient.invalidateQueries({ queryKey: ['recruiters'] });
    },
  });
};

export const useDeleteRecruiter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/recruiters/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['recruiters'] });
      queryClient.removeQueries({ queryKey: ['recruiter', id] });
    },
  });
};

export const useImportRecruitersCSV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const { data } = await apiClient.post('/recruiters/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiters'] });
    },
  });
};

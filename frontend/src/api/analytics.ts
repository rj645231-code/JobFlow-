import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';

export interface DashboardStats {
  totalApplications: number;
  activeApplications: number;
  totalInterviews: number;
  totalOffers: number;
  responseRate: number;
}

export interface ChartDataPoint {
  date: string;
  count: number;
}

export interface ResponseRates {
  status: string;
  rate: number;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['analytics', 'dashboard-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardStats>('/analytics/dashboard-stats');
      return data;
    },
  });
};

export const useWeeklyActivity = () => {
  return useQuery({
    queryKey: ['analytics', 'weekly-activity'],
    queryFn: async () => {
      const { data } = await apiClient.get<ChartDataPoint[]>('/analytics/weekly-activity');
      return data;
    },
  });
};

export const useApplicationsOverTime = (days: number = 30) => {
  return useQuery({
    queryKey: ['analytics', 'applications-over-time', { days }],
    queryFn: async () => {
      const { data } = await apiClient.get<ChartDataPoint[]>('/analytics/applications-over-time', {
        params: { days },
      });
      return data;
    },
  });
};

export const useResponseRates = () => {
  return useQuery({
    queryKey: ['analytics', 'response-rates'],
    queryFn: async () => {
      const { data } = await apiClient.get<ResponseRates[]>('/analytics/response-rates');
      return data;
    },
  });
};

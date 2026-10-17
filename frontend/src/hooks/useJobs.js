import { useQuery } from '@tanstack/react-query';
import { jobService } from '../services/jobService';

export const useJobs = (params) => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobService.getJobs(params),
    staleTime: 60 * 1000,
  });
};

export const useJobDetails = (id) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJobById(id),
    enabled: !!id,
  });
};

export const useWalkinJobs = (params) => {
  return useQuery({
    queryKey: ['walkin-jobs', params],
    queryFn: () => jobService.getWalkinJobs(params),
    staleTime: 60 * 1000,
  });
};

export const useNearbyJobs = (params) => {
  return useQuery({
    queryKey: ['nearby-jobs', params],
    queryFn: () => jobService.getNearbyJobs(params),
    enabled: !!params?.lat && !!params?.lng,
    staleTime: 60 * 1000,
  });
};

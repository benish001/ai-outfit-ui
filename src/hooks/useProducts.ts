import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['products', query],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/api/search`, {
        params: { q: query }
      });
      return data;
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
    refetchInterval: 1000 * 60 * 30, // Background refetch every 30 mins
  });
};

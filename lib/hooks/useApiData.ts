import { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api';

interface UseApiDataOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useApiData<T>(
  url: string, 
  params?: Record<string, any>,
  options: UseApiDataOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { enabled = true, refetchInterval } = options;

  const fetchData = async () => {
    if (!enabled) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiGet<T>(url, { params });
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url, JSON.stringify(params), enabled]);

  useEffect(() => {
    if (refetchInterval) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [refetchInterval]);

  return { data, loading, error, refetch: fetchData };
}

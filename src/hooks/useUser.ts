import { useCallback, useEffect, useRef, useState } from 'react';
import { User } from '../../types/user';
import { getUser } from '../api/users';

type UseUserResult = {
  data: User | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export default function useUser(): UseUserResult {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // start as loading
  const [error, setError] = useState<Error | null>(null);

  const mountedRef = useRef<boolean>(true);

  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const res = await getUser();
      if (mountedRef.current) setData(res.data);
    } catch (e) {
      if (mountedRef.current) setError(e as Error);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
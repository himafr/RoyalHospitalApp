import { useCallback, useEffect, useRef, useState } from 'react';
import { User } from '../../types/user';
import { getUser, updatePassword, updateUser } from '../api/users';
import type { Asset } from 'react-native-image-picker';
import { useAuth } from '../context/AuthContext';

type UseUserResult = {
  data: User | null;
  loading: boolean;
  error: Error | null;
  updatePersonalDetails: (v: User, photo?: Asset | null) => Promise<void>;
  passwordUpdate: ({
    newPass,
    oldPass,
  }: {
    newPass: string;
    oldPass: string;
  }) =>  Promise<number|undefined>;
  refetch: () => Promise<void>;
};

export default function useUser(): UseUserResult {
  const { updateToken } = useAuth();
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // start as loading
  const [error, setError] = useState<Error | null>(null);

  const mountedRef = useRef<boolean>(true);

  async function updatePersonalDetails(v: User, photo?: Asset | null) {
    setLoading(true);
    setError(null);

    try {
      const res = await updateUser(v, photo);
      const newToken = res.data?.token;
      if (newToken) {
        await updateToken(newToken);
        if (mountedRef.current) {
          setData(current => (current ? { ...current, ...v } : current));
        }
      } else if (mountedRef.current) {
        setData(res.data);
      }
    } catch (e) {
      if (mountedRef.current) setError(e as Error);
      throw e;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }
  async function passwordUpdate({
    newPass,
    oldPass,
  }: {
    newPass: string;
    oldPass: string;
  }) {
    setLoading(true);
    setError(null);
    try {
     const res= await updatePassword({ newPass, oldPass });
     return res.status 
    } catch (e) {
      if (mountedRef.current) setError(e as Error);
      throw e;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }

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

  return { data, loading, error, refetch: fetchData, updatePersonalDetails,passwordUpdate };
}

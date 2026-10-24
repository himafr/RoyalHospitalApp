import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/auth';

interface AuthContextData {
  fullName: string | null;
  email:string | null
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<any>;
  doctorSignup: (data: any) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem('auth_token');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedFullName = await AsyncStorage.getItem('full_name');
        if (storedToken && storedEmail && storedEmail) {
          setToken(storedToken);
          setEmail(storedEmail);
          setEmail(storedFullName);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (newToken: string, fullName: string,email:string) => {
    setToken(newToken);
    setEmail(email);
    setFullName(fullName);
    await AsyncStorage.setItem('auth_token', newToken);
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('full_name', fullName);
  };

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const { token: t, fullName: fn,email:e } = res.data;
    await persist(t, fn,e);
  };

  const signup = async (data: any) => {
    const res = await authApi.signup(data);
    return res.data;
  };

  const doctorSignup = async (data: any) => {
    const res = await authApi.doctorSignup(data);
    return res.data;
  };

  const signOut = async () => {
    try { await authApi.logout(); } catch {}
    setToken(null);
    setEmail(null);
    setFullName(null);
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        fullName,email, token, loading, isAuthenticated: !!token,
        login, signup, doctorSignup, signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
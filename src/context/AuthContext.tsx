import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/auth';
import {jwtDecode as decode } from "jwt-decode"
interface AuthContextData {
  fullName: string | null;
  email: string | null;
  role: string | null;
  token: string | null;
  isVerified:()=>boolean;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  updateToken: (newToken: string) => Promise<void>;
  signup: (data: any) => Promise<any>;
  doctorSignup: (data: any) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem('auth_token');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedRole = await AsyncStorage.getItem('role');
        const storedFullName = await AsyncStorage.getItem('full_name');
        if (storedToken && storedEmail && storedEmail) {
          setToken(storedToken);
          setEmail(storedEmail);
          setRole(storedRole);
          setEmail(storedFullName);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  

  const persist = async (newToken: string, fullName: string, email: string,role:string) => {
    setToken(newToken);
    setEmail(email);
    setRole(role);
    setFullName(fullName);
    await AsyncStorage.setItem('auth_token', newToken);
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('role', role);
    await AsyncStorage.setItem('full_name', fullName);
  };
  const updateToken = async (newToken: string) => {
    setToken(newToken);
    await AsyncStorage.setItem('auth_token', newToken);
  };
  const isVerified= ():boolean =>{
    console.log(decode(token||""))
   return  decode<{isActive:boolean}>(token||"").isActive
  }

  const login = async (email: string, password: string) => {
    console.log("first")
    const res = await authApi.login(email, password) as any
    const { token: t, fullName: fn, email: e,role:r } = res;
    console.log(t,fn,e,r)
    await persist(t, fn, e,r);
  };

  const signup = async (data: any) => {
    const res = await authApi.signup(data);
    return res;
  };

  const doctorSignup = async (data: any) => {
    const res = await authApi.doctorSignup(data);
    return res;
  };

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch {}
    setToken(null);
    setEmail(null);
    setFullName(null);
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        fullName,
        email,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        signup,
        doctorSignup,
        signOut,
        updateToken,
        isVerified,
        role
        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

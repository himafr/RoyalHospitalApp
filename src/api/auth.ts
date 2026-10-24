import client from './client';

export const login = (email: string, password: string) =>
  client.post('/api/auth/login', { email, password });

export const signup = (data: any) => client.post('/api/auth/signup', data);
export const doctorSignup = (data: any) => client.post('/api/auth/doctor-signup', data);
export const sendActivationCode = (email: string) =>
  client.post('/api/auth/activate/send', { email });
export const verifyActivationCode = (email: string, pin: string) =>
  client.post('/api/auth/activate/verify', { email, pin });
export const logout = () => client.post('/api/auth/logout');
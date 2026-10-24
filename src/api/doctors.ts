import client from './client';
export const getDoctors = (specialty?: string) =>
  client.get('/api/doctors', { params: { specialty } });
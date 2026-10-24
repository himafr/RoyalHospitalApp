import client from './client';
export const getServices = (specialty?: string) =>
  client.get('/api/services', { params: { specialty } });
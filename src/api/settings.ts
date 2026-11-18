import client from './client';


export const getSettings = () =>
  client.get('/settings');

export const updateSettings = (params:any) =>
  client.put('/settings',  params );


import { User } from '../../types/user';
import client from './client';

export const getUser = () =>
  client.get('/api/users');

export const updateUser = (form:User) =>
  client.put('/api/users',form);


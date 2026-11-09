import { User } from '../../types/user';
import type { Asset } from 'react-native-image-picker';
import client from './client';
import { createImageFormData } from '../utils/pickImage';
const BASE_URL = '/users';
export const getUser = () =>
  client.get(BASE_URL);

export const updateUser = async (
  form: User,
  photo?: Asset | null,
) => {
  if (!photo) return client.put(BASE_URL, form);

  const body = await createImageFormData(form, photo);
  return client.put(BASE_URL, body, {
    headers: { 'Content-Type':'multipart/form-data' },
  });
};

export const updatePassword = (data: any) => client.put(BASE_URL+'/update-password', data);

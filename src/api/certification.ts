import client from './client';
import type { Asset } from 'react-native-image-picker';
import { createImageFormData } from '../utils/pickImage';

export const getCertificationById = (params: {id:number}) =>
  client.get(`/doctors/certification/${params.id}`);

export const certificationAdd = async (
  data: Record<string, unknown>,
  photo?: Asset | null,
) => {
  if (!photo) return client.post('/doctors/certification', data);

  const body = await createImageFormData(data, photo);
  return client.post('/doctors/certification', body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const editCertificationById = async (params: {
  id: number;
  data: Record<string, unknown>;
  photo?: Asset | null;
}) => {
  if (!params.photo) {
    return client.put(`/doctors/certification/${params.id}`, params.data);
  }

  const body = await createImageFormData(params.data, params.photo);
  return client.put(`/doctors/certification/${params.id}`, body, {
    headers: { 'Content-Type': "multipart/form-data" },
  });
};

export const certificationDelete = (params: {id:number}) =>
  client.delete(`/doctors/certification/${params.id}` );

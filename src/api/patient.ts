import client from './client';


export const getPatient = () =>
  client.get('/api/patient');

export const getMedicalRecord = () =>
  client.get('/api/patient/medical-record');
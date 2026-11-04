import { BloodType } from '../../types/user';
import client from './client';


export const getPatient = () =>
  client.get('/api/patient');

export const getMedicalRecord = () =>
  client.get('/api/patient/medical-record');

export const updateEmergencyContact=(form:any)=>
  client.put('/api/patient/update-emergency-contact',form)

export const updateBloodType=(bloodType:BloodType)=>
  client.put('/api/patient/update-blood-type',{bloodType})
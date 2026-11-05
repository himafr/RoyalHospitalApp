import client from './client';

export const getCertificationById = (params: {id:number}) =>
  client.get(`/doctors/certification/${params.id}`);

export const certificationAdd = (params: any) =>
  client.post('/doctors/certification',  params );

export const editCertificationById = (params: {id:number,data:any}) =>
  client.put(`/doctors/certification/${params.id}`,  params.data );

export const certificationDelete = (params: {id:number}) =>
  client.delete(`/doctors/certification/${params.id}` );



import client from './client';

export const getBookedDates = (doctorId: number) =>
  client.get('/appointments/booked-dates', { params: { doctorId } });

export const getTodayBookedDatesForDoctor = () =>
  client.get('/appointments/doctor-today');

export const getAvailableSlots = (doctorId: number, date: string) =>
  client.get('/appointments/available-slots', { params: { doctorId, date } });

export const createAppointment = (data: {
  doctorId: number;      
  serviceId: number;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
}) => client.post('/appointments', data);
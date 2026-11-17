jest.mock('../src/api/client', () => ({
  __esModule: true,
  default: {
    delete: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock('../src/utils/pickImage', () => ({
  createImageFormData: jest.fn().mockResolvedValue('image-form-data'),
}));

import client from '../src/api/client';
import * as appointments from '../src/api/appointments';
import * as auth from '../src/api/auth';
import * as certifications from '../src/api/certification';
import * as doctors from '../src/api/doctors';
import * as patients from '../src/api/patient';
import * as services from '../src/api/services';
import * as users from '../src/api/users';
import { createImageFormData } from '../src/utils/pickImage';

const mockClient = jest.mocked(client);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('authentication API', () => {
  it('sends credentials and signup data to the expected endpoints', () => {
    auth.login('user@example.com', 'secret');
    auth.signup({ fullName: 'Test User' });
    auth.sendActivationCode();
    auth.verifyActivationCode('1234');
    auth.logout();

    expect(mockClient.post).toHaveBeenNthCalledWith(1, '/auth/login', {
      email: 'user@example.com',
      password: 'secret',
    });
    expect(mockClient.post).toHaveBeenNthCalledWith(2, '/auth/signup', {
      fullName: 'Test User',
    });
    expect(mockClient.post).toHaveBeenNthCalledWith(3, '/activation');
    expect(mockClient.put).toHaveBeenCalledWith('/activation', { pin: '1234' });
    expect(mockClient.post).toHaveBeenNthCalledWith(4, '/auth/logout');
  });
});

describe('appointments API', () => {
  it('passes pagination and scheduling parameters', () => {
    const pagination = { page: 2, size: 5 };
    const appointment = {
      doctorId: 7,
      serviceId: 3,
      appointmentDate: '2026-11-18',
      appointmentTime: '09:00',
      notes: 'Follow-up',
    };

    appointments.getAllAppointments(pagination);
    appointments.getAllAppointmentsForDoctor(pagination);
    appointments.getBookedDates(7);
    appointments.getTodayBookedDatesForDoctor();
    appointments.getAvailableSlots(7, '2026-11-18');
    appointments.createAppointment(appointment);

    expect(mockClient.get).toHaveBeenNthCalledWith(1, '/appointments', {
      params: pagination,
    });
    expect(mockClient.get).toHaveBeenNthCalledWith(2, '/appointments/doctor', {
      params: pagination,
    });
    expect(mockClient.get).toHaveBeenNthCalledWith(
      3,
      '/appointments/booked-dates',
      { params: { doctorId: 7 } },
    );
    expect(mockClient.get).toHaveBeenNthCalledWith(
      4,
      '/appointments/doctor-today',
    );
    expect(mockClient.get).toHaveBeenNthCalledWith(
      5,
      '/appointments/available-slots',
      { params: { doctorId: 7, date: '2026-11-18' } },
    );
    expect(mockClient.post).toHaveBeenCalledWith('/appointments', appointment);
  });
});

describe('directory and patient APIs', () => {
  it('calls doctor, service, and patient endpoints with their parameters', () => {
    const params = { page: 1, size: 10, specialty: 'CARDIOLOGY' };

    doctors.getDoctors(params);
    doctors.doctorUpdate({ yearsOfExperience: 5 });
    doctors.getDoctor();
    services.getServices(params);
    services.getServiceById(12);
    patients.getPatient();
    patients.getMedicalRecord();
    patients.updateEmergencyContact({ phone: '1234567890' });
    patients.updateBloodType('A_PLUS');

    expect(mockClient.get).toHaveBeenNthCalledWith(1, '/doctors', { params });
    expect(mockClient.put).toHaveBeenNthCalledWith(1, '/doctors', {
      yearsOfExperience: 5,
    });
    expect(mockClient.get).toHaveBeenNthCalledWith(2, '/doctors/me');
    expect(mockClient.get).toHaveBeenNthCalledWith(3, '/services', { params });
    expect(mockClient.get).toHaveBeenNthCalledWith(4, '/services/12');
    expect(mockClient.get).toHaveBeenNthCalledWith(5, '/patient');
    expect(mockClient.get).toHaveBeenNthCalledWith(
      6,
      '/patient/medical-record',
    );
    expect(mockClient.put).toHaveBeenNthCalledWith(
      2,
      '/patient/update-emergency-contact',
      { phone: '1234567890' },
    );
    expect(mockClient.put).toHaveBeenNthCalledWith(
      3,
      '/patient/update-blood-type',
      { bloodType: 'A_PLUS' },
    );
  });
});

describe('user API', () => {
  it('updates profile and password, using multipart data when a photo is supplied', async () => {
    const user = { fullName: 'Test User' } as any;
    const photo = { uri: 'file:///photo.jpg' } as any;

    users.getUser();
    users.updatePassword({ newPass: 'new', oldPass: 'old' });
    users.updateUser(user);
    await users.updateUser(user, photo);

    expect(mockClient.get).toHaveBeenCalledWith('/users');
    expect(mockClient.put).toHaveBeenNthCalledWith(1, '/users/update-password', {
      newPass: 'new',
      oldPass: 'old',
    });
    expect(mockClient.put).toHaveBeenNthCalledWith(2, '/users', user);
    expect(createImageFormData).toHaveBeenCalledWith(user, photo);
    expect(mockClient.put).toHaveBeenNthCalledWith(
      3,
      '/users',
      'image-form-data',
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  });
});

describe('certification API', () => {
  it('supports read, create, edit, and delete operations with and without photos', async () => {
    const data = { title: 'Board certification' };
    const photo = { uri: 'file:///certificate.jpg' } as any;

    certifications.getCertificationById({ id: 8 });
    await certifications.certificationAdd(data);
    await certifications.certificationAdd(data, photo);
    await certifications.editCertificationById({ id: 8, data });
    await certifications.editCertificationById({ id: 8, data, photo });
    certifications.certificationDelete({ id: 8 });

    expect(mockClient.get).toHaveBeenCalledWith('/doctors/certification/8');
    expect(mockClient.post).toHaveBeenNthCalledWith(
      1,
      '/doctors/certification',
      data,
    );
    expect(mockClient.post).toHaveBeenNthCalledWith(
      2,
      '/doctors/certification',
      'image-form-data',
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    expect(mockClient.put).toHaveBeenNthCalledWith(
      1,
      '/doctors/certification/8',
      data,
    );
    expect(mockClient.put).toHaveBeenNthCalledWith(
      2,
      '/doctors/certification/8',
      'image-form-data',
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    expect(mockClient.delete).toHaveBeenCalledWith(
      '/doctors/certification/8',
    );
  });
});

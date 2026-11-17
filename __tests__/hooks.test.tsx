import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';

jest.mock('../src/utils/toast', () => ({
  showErrorToast: jest.fn(),
}));

jest.mock('../src/api/appointments', () => ({
  createAppointment: jest.fn(),
  getAvailableSlots: jest.fn(),
  getBookedDates: jest.fn(),
}));

jest.mock('../src/api/doctors', () => ({
  getDoctors: jest.fn(),
}));

jest.mock('../src/api/services', () => ({
  getServices: jest.fn(),
}));

import {
  createAppointment,
  getAvailableSlots,
  getBookedDates,
} from '../src/api/appointments';
import useAppointment from '../src/features/appointment/useAppointment';
import useInfiniteScroll from '../src/hooks/useInfiniteScroll';
import { ThemeProvider } from '../src/context/ModeContext';

const mockCreateAppointment = jest.mocked(createAppointment);
const mockGetAvailableSlots = jest.mocked(getAvailableSlots);
const mockGetBookedDates = jest.mocked(getBookedDates);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useInfiniteScroll', () => {
  it('loads the first page, appends the next page, and stops at the last page', async () => {
    const fetchApi = jest
      .fn()
      .mockResolvedValueOnce({
        data: { content: [{ id: 1 }], last: false },
      })
      .mockResolvedValueOnce({
        data: { content: [{ id: 2 }], last: true },
      });
    let result!: ReturnType<typeof useInfiniteScroll>;

    function Harness() {
      result = useInfiniteScroll({ fetchApi, selectedSpec: 'CARDIOLOGY' });
      return null;
    }

    await act(async () => {
      ReactTestRenderer.create(
        <ThemeProvider>
          <Harness />
        </ThemeProvider>,
      );
    });

    expect(fetchApi).toHaveBeenNthCalledWith(1, {
      page: 0,
      size: 3,
      specialty: 'CARDIOLOGY',
    });
    expect(result.data).toEqual([{ id: 1 }]);

    await act(async () => {
      result.loadMore();
      await Promise.resolve();
    });

    expect(fetchApi).toHaveBeenNthCalledWith(2, {
      page: 1,
      size: 3,
      specialty: 'CARDIOLOGY',
    });
    expect(result.data).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.hasMore).toBe(false);

    await act(async () => {
      result.loadMore();
    });
    expect(fetchApi).toHaveBeenCalledTimes(2);
  });
});

describe('useAppointment', () => {
  it('requires the required fields, submits a complete booking, and resets the form', async () => {
    mockGetBookedDates.mockResolvedValue({ data: [] } as any);
    mockGetAvailableSlots.mockResolvedValue({ data: ['09:00'] } as any);
    mockCreateAppointment.mockResolvedValue({} as any);
    let result!: ReturnType<typeof useAppointment>;

    function Harness() {
      result = useAppointment(7, 3);
      return null;
    }

    await act(async () => {
      ReactTestRenderer.create(
        <ThemeProvider>
          <Harness />
        </ThemeProvider>,
      );
      await Promise.resolve();
    });

    await act(async () => {
      expect(await result.submitBooking()).toEqual({
        error: 'يرجى تعبئة جميع الحقول المطلوبة',
      });
    });
    expect(mockCreateAppointment).not.toHaveBeenCalled();

    await act(async () => {
      result.setField('date', '2026-11-18');
      result.setField('time', '09:00');
      result.setField('notes', 'Follow-up');
    });
    let submission!: Awaited<ReturnType<typeof result.submitBooking>>;
    await act(async () => {
      submission = await result.submitBooking();
    });

    expect(mockCreateAppointment).toHaveBeenCalledWith({
      doctorId: 7,
      serviceId: 3,
      appointmentDate: '2026-11-18',
      appointmentTime: '09:00',
      notes: 'Follow-up',
    });
    expect(submission).toEqual({
      success: 'تم طلب الحجز بنجاح، سيتم التواصل معك للتأكيد.',
    });
    expect(result.form).toEqual({
      specialty: '',
      doctorId: 7,
      serviceId: 3,
      date: '',
      time: '',
      notes: '',
    });
  });

  it('returns the server error when booking fails', async () => {
    mockGetBookedDates.mockResolvedValue({ data: [] } as any);
    mockCreateAppointment.mockRejectedValue({
      response: { data: { message: 'Slot unavailable' } },
    });
    let result!: ReturnType<typeof useAppointment>;

    function Harness() {
      result = useAppointment(7, 3);
      return null;
    }

    await act(async () => {
      ReactTestRenderer.create(
        <ThemeProvider>
          <Harness />
        </ThemeProvider>,
      );
      await Promise.resolve();
    });
    await act(async () => {
      result.setField('date', '2026-11-18');
      result.setField('time', '09:00');
    });

    let submission!: Awaited<ReturnType<typeof result.submitBooking>>;
    await act(async () => {
      submission = await result.submitBooking();
    });

    expect(submission).toEqual({ error: 'Slot unavailable' });
  });
});

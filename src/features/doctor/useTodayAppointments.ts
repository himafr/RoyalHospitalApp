import { useState, useEffect, useCallback } from 'react';
import { getTodayBookedDatesForDoctor } from '../../api/appointments';
import { showErrorToast } from '../../utils/toast';
import { Appointment } from '../../../types/medical';

export default function useTodayAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTodayBookedDatesForDoctor();
      setAppointments(res.data || []);
    } catch (e) {
      console.log('Error fetching today appointments', e);
      showErrorToast('تعذر تحميل حجوزات اليوم.');
    } finally {
      setLoading(false);
    }
  }, []);

  function getDoneAppointments() {
    return appointments.filter(app => app.status === 'COMPLETED');
  }
  function getStillAppointments() {
    return appointments.filter(app => app.status !== 'COMPLETED');
  }

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    refetch: fetchAppointments,
    count: appointments.length,
    done: getDoneAppointments(),
    still: getStillAppointments(),
  };
}

import { useState, useEffect, useCallback } from 'react';
import {  getAllAppointmentsForDoctor } from '../../api/appointments';
import { showErrorToast } from '../../utils/toast';
import { useTheme } from '../../context/ModeContext';

const PAGE_SIZE = 5;

export default function useAllAppointments() {
  const { t } = useTheme();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAppointments = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await getAllAppointmentsForDoctor({ page: pageNumber, size: PAGE_SIZE });
      setAppointments(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNumber);
    } catch (e) {
      console.log('Error fetching appointments:', e);
      showErrorToast(t('err_network'), t('error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAppointments(0);
  }, [fetchAppointments]);

  return { appointments, loading, page, totalPages, goToPage: fetchAppointments };
}
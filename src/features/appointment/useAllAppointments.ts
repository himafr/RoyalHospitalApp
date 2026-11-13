import { useState, useEffect, useCallback } from 'react';
import {  getAllAppointmentsForDoctor } from '../../api/appointments';
import { showErrorToast } from '../../utils/toast';

const PAGE_SIZE = 5;

export default function useAllAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAppointments = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await getAllAppointmentsForDoctor({ page: pageNumber, size: PAGE_SIZE });
      // بنفترض إن res هو الـ Page Object
      setAppointments(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNumber);
    } catch (e) {
      console.log('Error fetching appointments:', e);
      showErrorToast('تعذر تحميل المواعيد.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments(0);
  }, [fetchAppointments]);

  return { appointments, loading, page, totalPages, goToPage: fetchAppointments };
}
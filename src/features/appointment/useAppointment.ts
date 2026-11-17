import { useCallback, useEffect, useState } from 'react';
import { createAppointment, getAvailableSlots, getBookedDates } from '../../api/appointments';
import { getDoctors } from '../../api/doctors';
import { getServices } from '../../api/services';
import { showErrorToast } from '../../utils/toast';
import { useTheme } from '../../context/ModeContext';

const DEFAULT_SLOTS = ['09:00', '11:30', '16:30', '19:00'];

export default function useAppointment(
  initialDoctorId?: number,
  initialServiceId?: number,
  initialSpecialty?: string
) {
  const { t } = useTheme();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
const initialForm={
    specialty: initialSpecialty || '',
    doctorId: initialDoctorId || null,
    serviceId: initialServiceId || null,
    date: '',
    time: '',
    notes: '',
  }
  const [form, setForm] = useState(initialForm);

  // 1. جلب البيانات الأولية (أطباء وخدمات) بناءً على التخصص
  const loadInitialData = useCallback(async (specialty: string) => {
    if (!specialty) return;
    setLoading(true);
    try {
      const [docsRes, servsRes] = await Promise.all([
        getDoctors({ page: 0, size: 100,  specialty }),
        getServices({ page: 0, size: 100,  specialty }),
      ]);
      setDoctors(docsRes.data.content || []);
      setServices(servsRes.data.content || []);
    } catch (e) {
      console.log('Error loading initial data', e);
      showErrorToast(t('err_network'), t('error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // 2. فلترة الخدمات بناءً على تخصص الطبيب
  const loadServicesForDoctor = useCallback(async (doctorId: number|null, specialty: string) => {
    try {
      const res = await getServices({ page: 0, size: 100, specialty });
      setServices(res.data.content || []);
    } catch (e) {
      console.log('Error loading services for doctor', e);
      showErrorToast(t('err_network'), t('error'));
    }
  }, [t]);

  // 3. فلترة الأطباء بناءً على تخصص الخدمة
  const loadDoctorsForService = useCallback(async (serviceId: number|null, specialty: string) => {
    try {
      const res = await getDoctors({ page: 0, size: 100,  specialty });
      setDoctors(res.data.content || []);
    } catch (e) {
      console.log('Error loading doctors for service', e);
      showErrorToast(t('err_network'), t('error'));
    }
  }, [t]);

  // 4. جلب التواريخ المحجوزة لما الدكتور يتغير
  useEffect(() => {
    if (form.doctorId) {
      getBookedDates(form.doctorId)
        .then(res => setBookedDates(res.data || []))
        .catch(() => showErrorToast(t('err_network'), t('error')));
    }
  }, [form.doctorId, t]);


// 5. جلب الفترات المتاحة لما التاريخ يتغير
useEffect(() => {
  if (form.doctorId && form.date) {
    if (bookedDates.includes(form.date)) {
      setAvailableSlots([]); // لو اليوم كله محجوز
      return;
    }
    
    getAvailableSlots(form.doctorId, form.date)
      .then(res => {
        const serverSlots = res.data || [];
        if (serverSlots.length > 0) {
          // لو السيرفر رجع فترات، نعرضها
          setAvailableSlots(DEFAULT_SLOTS.filter(slot => !serverSlots.includes(slot)));
        } else {
          // ✨ لو السيرفر رجع فاضي، نعرض الفترات الافتراضية
          setAvailableSlots(DEFAULT_SLOTS);
        }
      })
      .catch(() => {
        // لو حصل خطأ، نعرض الفترات الافتراضية برضه
        setAvailableSlots(DEFAULT_SLOTS);
        showErrorToast(t('err_network'), t('error'));
      });
  }
}, [form.doctorId, form.date, bookedDates, t]);

  // 6. دالة تأكيد الحجز
  const submitBooking = async () => {
    if (!form.doctorId || !form.serviceId || !form.date || !form.time) {
      return { error: t('fill_all_fields') };
    }
    setBooking(true);
    try {
      await createAppointment({
        doctorId: form.doctorId,
        serviceId: form.serviceId,
        appointmentDate: form.date,
        appointmentTime: form.time,
        notes: form.notes,
      });
      setForm(initialForm)
      return { success: t('booking_success') };
    } catch (error: any) {
      return { error: error.response?.data?.message || t('booking_error') };
    } finally {
      setBooking(false);
    }
  };

  // 7. تغيير التخصص (بيعيد تحميل الأطباء والخدمات)
  const setSpecialty = useCallback((specialty: string) => {
    setForm(previous => ({ ...previous, specialty, doctorId: null, serviceId: null }));
    loadInitialData(specialty);
  }, [loadInitialData]);

  // 8. تحديث حقل معين
  const setField = useCallback((key: string, value: any) => {
    setForm(previous => ({ ...previous, [key]: value }));
  }, []);

  // 9. تشغيل التحميل الأولي لو إحنا جايين بتخصص
  useEffect(() => {
    if (initialSpecialty) {
      loadInitialData(initialSpecialty);
    }
  }, [initialSpecialty, loadInitialData]);

  return {
    form,
    doctors,
    services,
    bookedDates,
    availableSlots,
    loading,
    booking,
    setSpecialty,
    setField,
    submitBooking,
    loadServicesForDoctor,
    loadDoctorsForService,
    loadInitialData,
  };
}
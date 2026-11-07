import { useState, useEffect, useCallback } from 'react';
import { getDoctors } from '../../api/doctors';
import { getServices } from '../../api/services';
import { getBookedDates, getAvailableSlots, createAppointment } from '../../api/appointments';
import { showErrorToast } from '../../utils/toast';

const DEFAULT_SLOTS = ['09:00', '11:30', '16:30', '19:00'];

export default function useAppointment(
  initialDoctorId?: number,
  initialServiceId?: number,
  initialSpecialty?: string
) {
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
      showErrorToast('تعذر تحميل بيانات الأطباء والخدمات.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. فلترة الخدمات بناءً على تخصص الطبيب
  const loadServicesForDoctor = useCallback(async (doctorId: number|null, specialty: string) => {
    try {
      const res = await getServices({ page: 0, size: 100, specialty });
      setServices(res.data.content || []);
    } catch (e) {
      console.log('Error loading services for doctor', e);
      showErrorToast('تعذر تحميل الخدمات لهذا التخصص.');
    }
  }, []);

  // 3. فلترة الأطباء بناءً على تخصص الخدمة
  const loadDoctorsForService = useCallback(async (serviceId: number|null, specialty: string) => {
    try {
      const res = await getDoctors({ page: 0, size: 100,  specialty });
      setDoctors(res.data.content || []);
    } catch (e) {
      console.log('Error loading doctors for service', e);
      showErrorToast('تعذر تحميل الأطباء لهذا التخصص.');
    }
  }, []);

  // 4. جلب التواريخ المحجوزة لما الدكتور يتغير
  useEffect(() => {
    if (form.doctorId) {
      getBookedDates(form.doctorId)
        .then(res => setBookedDates(res.data || []))
        .catch(() => showErrorToast('تعذر التحقق من المواعيد المحجوزة.'));
    }
  }, [form.doctorId]);

  // ... جوه الـ useAppointment

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
        showErrorToast('تعذر التحقق من الفترات المتاحة.');
      });
  }
}, [form.doctorId, form.date, bookedDates]);

  // 6. دالة تأكيد الحجز
  const submitBooking = async () => {
    if (!form.doctorId || !form.serviceId || !form.date || !form.time) {
      return { error: 'يرجى تعبئة جميع الحقول المطلوبة' };
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
      return { success: 'تم طلب الحجز بنجاح، سيتم التواصل معك للتأكيد.' };
    } catch (error: any) {
      return { error: error.response?.data?.message || 'حدث خطأ أثناء الحجز' };
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
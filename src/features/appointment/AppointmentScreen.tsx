import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import useAppointment from './useAppointment';
import { SPECIALTIES } from '../../constants';
import { colors, spacing, radius } from '../../theme';

export default function AppointmentScreen({ route, navigation }: any) {
  // 1. بنشوف إحنا جايين منين
  const {
    doctorId: initialDoctorId,
    serviceId: initialServiceId,
    specialty,
  } = route?.params || {};

  // 2. نمرر القيم للـ Hook
  const {
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
  } = useAppointment(initialDoctorId, initialServiceId);

  // 2. جوه المكون (قبل الـ return)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isFriday = form.date ? new Date(form.date).getDay() === 5 : false;

  // 3. دالة التعامل مع اختيار التاريخ
  const onChangeDate = (event: any, date?: Date) => {
    // في الأندرويد، بنقفل الـ Picker بعد ما يختار
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      // بنحول التاريخ لصيغة YYYY-MM-DD عشان تتبعت للسيرفر
      const formattedDate = date.toISOString().split('T')[0];
      setField('date', formattedDate);
    }
  };

  // 3. نضبط الشاشة أول ما تفتح
  useEffect(() => {
    if (specialty) setSpecialty(specialty);

    // لو جاي من دكتور، نحدد الدكتور ونفلتر الخدمات
    if (initialDoctorId) {
      setField('doctorId', initialDoctorId);
      loadServicesForDoctor(initialDoctorId, specialty);
    }

    // لو جاي من خدمة، نحدد الخدمة ونفلتر الأطباء
    if (initialServiceId) {
      setField('serviceId', initialServiceId);
      loadDoctorsForService(initialServiceId, specialty);
    }
  }, [initialDoctorId, initialServiceId, specialty]);

  const isDateFullyBooked = form.date ? bookedDates.includes(form.date) : false;

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* الهيدر */}
      <View style={styles.header}>
        <Ionicons name="calendar" size={48} color={colors.gold} />
        <Text style={styles.title}>نموذج حجز المواعيد</Text>
        <Text style={styles.sub}>
          يرجى تعبئة البيانات المطلوبة بدقة لضمان حصولكم على أفضل رعاية طبية.
        </Text>
      </View>

      <View style={styles.form}>
        {/* القسم */}
        <Text style={styles.label}>القسم / التخصص</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.specialty}
            onValueChange={v => setSpecialty(v)}
            enabled={!loading}
          >
            <Picker.Item label="اختر القسم المطلوب" value="" />
            {SPECIALTIES.map(s => (
              <Picker.Item key={s.id} label={s.label} value={s.id} />
            ))}
          </Picker>
        </View>

        {/* الطبيب (بيظهر لو مش جاي من خدمة) */}
        <Text style={styles.label}>الطبيب المختص</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.doctorId}
            onValueChange={v => {
              setField('doctorId', v);
              loadServicesForDoctor(v, form.specialty); // فلترة الخدمات
            }}
            enabled={!loading && doctors.length > 0}
          >
            <Picker.Item label="اختر الطبيب المفضل" value={null} />
            {doctors.map(d => (
              <Picker.Item key={d.id} label={`د. ${d.fullName}`} value={d.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>الخدمة الطبية</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.serviceId}
            onValueChange={v => {
              setField('serviceId', v);
              loadDoctorsForService(v, form.specialty); // فلترة الأطباء
            }}
            enabled={!loading && services.length > 0}
          >
            <Picker.Item label="اختر الخدمة المناسبة" value={null} />
            {services.map(s => (
              <Picker.Item key={s.id} label={s.name} value={s.id} />
            ))}
          </Picker>
        </View>

        {/* 4. التاريخ (باستخدام DatePicker) */}
        <Text style={styles.label}>تاريخ الزيارة</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => {
          if (form.doctorId && form.serviceId && form.specialty) setShowDatePicker(true);
          }}
        >
          <Text
            style={{
              color: form.date ? colors.primary : colors.textMuted,
              textAlign: 'right',
            }}
          >
            {form.date || 'اختر تاريخ الزيارة'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color={colors.gold} />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={onChangeDate}
          />
        )}

        {isDateFullyBooked && (
          <Text style={styles.error}>
            هذا اليوم محجوز بالكامل، اختر يوماً آخر.
          </Text>
        )}
        {isFriday ? (
          <Text style={styles.error}>
            الجمعة إجازة رسمية، يرجى اختيار يوم آخر.
          </Text>
        ) : (
          form.doctorId &&
          form.date &&
          !isDateFullyBooked && (
            <>
              <Text style={styles.label}>الفترات المتاحة</Text>
              <View style={styles.timeGrid}>
                {availableSlots.length > 0 ? (
                  availableSlots.map(time => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlot,
                        form.time === time && styles.timeSlotActive,
                      ]}
                      onPress={() => setField('time', time)}
                    >
                      <Text
                        style={[
                          styles.timeText,
                          form.time === time && styles.timeTextActive,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noSlots}>
                    لا توجد فترات متاحة في هذا اليوم.
                  </Text>
                )}
              </View>
            </>
          )
        )}

        {/* الملاحظات */}
        <Text style={styles.label}>ملاحظات طبية إضافية</Text>
        <InputField
          label=""
          value={form.notes}
          onChangeText={t => setField('notes', t)}
          placeholder="يرجى كتابة أي ملاحظات..."
          multiline
          style={{ height: 100 }}
        />

        <PrimaryButton
          title="تأكيد طلب الحجز"
          onPress={async () => {
            const result = await submitBooking();
            if (result.error) Alert.alert('خطأ', result.error);
            else if (result.success)
              Alert.alert('تم', result.success, [
                { text: 'حسناً', onPress: () => navigation.goBack() },
              ]);
          }}
          loading={booking}
          icon="checkmark-circle"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.bgLight,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
    marginTop: spacing.sm,
  },
  sub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  form: { padding: spacing.lg },
  label: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  picker: { color: colors.primary },
  dateInput: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    textAlign: 'right',
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  timeGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  timeSlot: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.bgGray,
    alignItems: 'center',
  },
  timeSlotActive: { backgroundColor: colors.primary, borderColor: colors.gold },
  timeText: { fontWeight: '700', color: colors.textSecondary },
  timeTextActive: { color: colors.gold },
  noSlots: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'right',
    width: '100%',
    padding: spacing.md,
  },
});

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import useAppointment from './useAppointment';
import { SPECIALTIES } from '../../constants';
import { spacing, radius, lightMode } from '../../theme';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import SmoothScrollView from '../../components/SmoothScrollView';
import { useTheme } from '../../context/ModeContext';

export default function AppointmentScreen({ route, navigation }: any) {
  const { colors } = useTheme();

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
  }, [
    initialDoctorId,
    initialServiceId,
    specialty,
    loadDoctorsForService,
    loadServicesForDoctor,
    setField,
    setSpecialty,
  ]);

  const isDateFullyBooked = form.date ? bookedDates.includes(form.date) : false;
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <SmoothScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* الهيدر */}
      <View style={styles.header}>
        <Ionicons name="calendar" size={48} color={colors.primary} />
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
            style={{ color: colors.text }}
            dropdownIconColor={colors.icon}
            itemStyle={{ color: colors.text }}
          >
            <Picker.Item
              label="اختر القسم المطلوب"
              color={colors.placeholder}
              style={{ backgroundColor: colors.modal }}
              value=""
            />
            {SPECIALTIES.map(s => (
              <Picker.Item
                key={s.id}
                label={s.label}
                value={s.id}
                color={colors.text}
                style={{ backgroundColor: colors.modal }}
              />
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
              loadServicesForDoctor(v, form.specialty);
            }}
            enabled={!loading && doctors.length > 0}
            style={{ color: colors.text }}
            dropdownIconColor={colors.icon}
            itemStyle={{ color: colors.text }}
          >
            <Picker.Item label="اختر الطبيب المفضل" value={null}
                color={colors.placeholder}
              style={{ backgroundColor: colors.modal }} />
            {doctors.map(d => (
              <Picker.Item key={d.id} label={`د. ${d.fullName}`} value={d.id}
               color={colors.text}
                style={{ backgroundColor: colors.modal }} />
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
           style={{ color: colors.text }}
            dropdownIconColor={colors.icon}
            itemStyle={{ color: colors.text }}
          >
            <Picker.Item label="اختر الخدمة المناسبة" value={null}
                color={colors.placeholder}
              style={{ backgroundColor: colors.modal }} />
            {services.map(s => (
              <Picker.Item key={s.id} label={s.name} value={s.id}
               color={colors.text}
                style={{ backgroundColor: colors.modal }} />
            ))}
          </Picker>
        </View>

        {/* 4. التاريخ (باستخدام DatePicker) */}
        <Text style={styles.label}>تاريخ الزيارة</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => {
            if (form.doctorId && form.serviceId && form.specialty)
              setShowDatePicker(true);
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
          <Ionicons name="calendar-outline" size={20} color={colors.primary} />
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
            if (result.error) showErrorToast(result.error);
            else if (result.success) {
              showSuccessToast(result.success, 'تم إرسال طلب الحجز');
              navigation.goBack();
            }
          }}
          loading={booking}
          icon="checkmark-circle"
        />
      </View>
    </SmoothScrollView>
  );
}
const getStyles = (colors: typeof lightMode) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    header: {
      padding: spacing.lg,
      backgroundColor: colors.backgroundAlt,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: '900',
      color: colors.text,
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
      color: colors.text,
      fontWeight: '700',
      textAlign: 'right',
      marginBottom: spacing.xs,
      marginTop: spacing.md,
    },
    pickerWrapper: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBackground,
      borderRadius: radius.md,
      marginBottom: spacing.md,
      overflow: 'hidden',
    },
    picker: { color: colors.text },
    dateInput: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBackground,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    error: {
      color: colors.error,
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
      backgroundColor: colors.card,
      alignItems: 'center',
    },
    timeSlotActive: {
      backgroundColor: colors.primary,
      borderColor: colors.iconActive,
    },
    timeText: { fontWeight: '700', color: colors.textSecondary },
    timeTextActive: { color: colors.onPrimary },
    noSlots: {
      color: colors.textMuted,
      fontSize: 14,
      textAlign: 'right',
      width: '100%',
      padding: spacing.md,
    },
  });

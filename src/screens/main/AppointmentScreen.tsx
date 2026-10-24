import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, radius } from '../../theme';

export default function AppointmentScreen() {
  const [notes, setNotes] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const timeSlots = ['09:00', '11:30', '16:30', '19:00'];

  return (
    <ScrollView style={styles.root}>
      <View style={styles.header}>
        <Ionicons name="calendar" size={48} color={colors.gold} />
        <Text style={styles.title}>نموذج حجز المواعيد</Text>
        <Text style={styles.sub}>يرجى تعبئة البيانات المطلوبة بدقة لضمان حصولكم على أفضل رعاية طبية.</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>تحديد الخدمة الطبية</Text>
        {/* هنا ممكن تستخدم Picker للقسم والطبيب والخدمة */}
        <Text style={styles.placeholderText}>سيتم إضافة اختيار القسم والطبيب والخدمة قريباً</Text>

        <Text style={styles.sectionTitle}>الموعد المقترح</Text>
        <Text style={styles.label}>الفترات المتاحة</Text>
        <View style={styles.timeGrid}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeSlot, selectedTime === time && styles.timeSlotActive]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.timeText, selectedTime === time && styles.timeTextActive]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>ملاحظات طبية إضافية</Text>
        <InputField
          label="ملاحظاتك"
          value={notes}
          onChangeText={setNotes}
          placeholder="يرجى كتابة أي ملاحظات..."
          multiline
          style={{ height: 100 }}
        />

        <PrimaryButton title="تأكيد طلب الحجز" onPress={() => alert('سيتم ربط الحجز بالـ API قريباً')} icon="checkmark-circle" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: { padding: spacing.lg, backgroundColor: colors.bgLight, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: colors.primary, marginTop: spacing.sm },
  sub: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  form: { padding: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.primary, textAlign: 'right', marginTop: spacing.md, marginBottom: spacing.sm },
  placeholderText: { color: colors.textMuted, fontSize: 14, textAlign: 'right', marginBottom: spacing.md, fontStyle: 'italic' },
  label: { fontSize: 14, color: colors.primary, fontWeight: '700', textAlign: 'right', marginBottom: spacing.xs, marginTop: spacing.md },
  timeGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  timeSlot: {
    flex: 1, minWidth: '45%', padding: spacing.md,
    borderRadius: radius.md, borderWidth: 2,
    borderColor: colors.border, backgroundColor: colors.bgGray,
    alignItems: 'center',
  },
  timeSlotActive: { backgroundColor: colors.primary, borderColor: colors.gold },
  timeText: { fontWeight: '700', color: colors.textSecondary },
  timeTextActive: { color: colors.gold },
});
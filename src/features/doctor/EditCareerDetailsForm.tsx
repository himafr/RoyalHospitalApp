import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, spacing, radius } from '../../theme';
import client from '../../client';
import useDoctor from './useDoctor';

export default function EditCareerDetailsForm({ navigation }: any) {
  const { doctor: user, loading, refetch } = useDoctor();
  const [form, setForm] = useState({
    specialty: '',
    specialization: '',
    work: '',
    about: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        specialty: user.specialty || 'GENERAL',
        specialization: user.specialization || '',
        work: user.work || '',
        about: user.about || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // بناءً على الـ Postman
      await client.post('/doctors/update-career-details', form);
      Alert.alert('تم', 'تم تحديث المعلومات المهنية بنجاح');
      await refetch(); // تحديث البيانات
      navigation.goBack(); // قفل الـ Modal
    } catch (error: any) {
      Alert.alert('خطأ', error.response?.data?.message || 'حدث خطأ أثناء التحديث');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !user) return <ActivityIndicator size="large" color={colors.primary} />;

  return (
    <View>
      <Text style={styles.label}>التخصص</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={form.specialty} onValueChange={(v) => setForm({ ...form, specialty: v })}>
          <Picker.Item label="طب عام" value="GENERAL" />
          <Picker.Item label="أسنان" value="DENTISTRY" />
          <Picker.Item label="جلدية" value="DERMATOLOGY" />
          <Picker.Item label="عيون" value="OPHTHALMOLOGY" />
          <Picker.Item label="القلب والأوعية الدموية" value="CARDIOLOGY" />
          <Picker.Item label="الجلدية والتجميل" value="COSMETIC_DERMATOLOGY" />
          <Picker.Item label="طب الأطفال" value="PEDIATRICS" />
          <Picker.Item label="طب الأسرة" value="FAMILY_MEDICINE" />
        </Picker>
      </View>

      <Text style={styles.label}>المسمى الوظيفي</Text>
      <TextInput style={styles.input} value={form.specialization} onChangeText={(t) => setForm({ ...form, specialization: t })} />

      <Text style={styles.label}>العضويات المهنية</Text>
      <TextInput style={styles.input} value={form.work} onChangeText={(t) => setForm({ ...form, work: t })} />

      <Text style={styles.label}>نبذة عن الطبيب</Text>
      <TextInput 
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
        value={form.about} 
        onChangeText={(t) => setForm({ ...form, about: t })} 
        multiline 
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveBtnText}>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, color: colors.primary, fontWeight: '700', marginBottom: spacing.xs, textAlign: 'right' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, textAlign: 'right' },
  pickerWrapper: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, marginBottom: spacing.md, overflow: 'hidden' },
  saveBtn: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  saveBtnText: { color: colors.gold, fontWeight: '900', fontSize: 16 },
});
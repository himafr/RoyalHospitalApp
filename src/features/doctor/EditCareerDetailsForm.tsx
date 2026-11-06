import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, radius, spacing } from '../../theme';
import useDoctor from './useDoctor';

export default function EditCareerDetailsForm({
  navigation,
  refetchData,
}: any) {
  const { doctor: user, loading, editDoctorCareer ,error} = useDoctor();
  const [form, setForm] = useState({
    specialty: '',
    specialization: '',
    work: '',
    about: '',
  });

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
    await editDoctorCareer({ data: form });
    if(error) return Alert.alert('فشل', error.message);
      Alert.alert('تم', 'تم تحديث المعلومات المهنية بنجاح');
    
    await refetchData();
    navigation.goBack();
  };

  if (loading && !user)
    return <ActivityIndicator size="large" color={colors.primary} />;

  return (
    <View>
      <Text style={styles.label}>التخصص</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={form.specialty}
          onValueChange={v => setForm({ ...form, specialty: v })}
        >
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
      <TextInput
        style={styles.input}
        value={form.specialization}
        onChangeText={t => setForm({ ...form, specialization: t })}
      />

      <Text style={styles.label}>العضويات المهنية</Text>
      <TextInput
        style={styles.input}
        value={form.work}
        onChangeText={t => setForm({ ...form, work: t })}
      />

      <Text style={styles.label}>نبذة عن الطبيب</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        value={form.about}
        onChangeText={t => setForm({ ...form, about: t })}
        multiline
      />

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveBtnText}>
          {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    textAlign: 'right',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  saveBtnText: { color: colors.gold, fontWeight: '900', fontSize: 16 },
});

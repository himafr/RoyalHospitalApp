import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import useDoctor from './useDoctor';
import { getErrorMessage, showErrorToast, showSuccessToast } from '../../utils/toast';
import type { Asset } from 'react-native-image-picker';
import { pickImage } from '../../utils/pickImage';

export default function AddCertificationForm({ navigation ,refetchData}: any) {
  const {  addCertification,loading } = useDoctor();
  const [form, setForm] = useState({
    name: '',
    place: '',
    organization: '',
  });
  const [photo, setPhoto] = useState<Asset | null>(null);

  const handleSave = async () => {
    if (!form.name || !form.organization) {
      return Alert.alert('تنبيه', 'يرجى ملء اسم الشهادة والجهة المانحة');
    }
    
    try {
      await addCertification(form, photo)
      showSuccessToast('تم إضافة الشهادة بنجاح.');
      await refetchData();
      navigation.goBack();
    } catch (error: any) {
      showErrorToast(getErrorMessage(error, 'تعذر إضافة الشهادة.'));
    } finally {
    }
  };

  const handlePickPhoto = async () => {
    try {
      const selectedPhoto = await pickImage();
      if (selectedPhoto) setPhoto(selectedPhoto);
    } catch (error: unknown) {
      showErrorToast(getErrorMessage(error, 'تعذر اختيار صورة الشهادة.'));
    }
  };

  return (
    <View>
      <Text style={styles.label}>اسم الشهادة</Text>
      <TextInput style={styles.input} value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />

      <Text style={styles.label}>الجهة المانحة (الجامعة/المعهد)</Text>
      <TextInput style={styles.input} value={form.organization} onChangeText={(t) => setForm({ ...form, organization: t })} />

      <Text style={styles.label}>المكان (البلد/المدينة)</Text>
      <TextInput style={styles.input} value={form.place} onChangeText={(t) => setForm({ ...form, place: t })} />

      <TouchableOpacity style={styles.photoBtn} onPress={handlePickPhoto}>
        <Text style={styles.photoBtnText}>
          {photo?.fileName || 'اختيار صورة الشهادة (اختياري)'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? 'جاري الحفظ...' : 'حفظ'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, color: colors.primary, fontWeight: '700', marginBottom: spacing.xs, textAlign: 'right' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, textAlign: 'right' },
  saveBtn: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  photoBtn: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, alignItems: 'center' },
  photoBtnText: { color: colors.primary, fontWeight: '700' },
  saveBtnText: { color: colors.gold, fontWeight: '900', fontSize: 16 },
});
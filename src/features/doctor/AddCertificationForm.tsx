import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { Asset } from 'react-native-image-picker';
import { useTheme } from '../../context/ModeContext';
import { lightMode, radius, spacing } from '../../theme';
import { pickImage } from '../../utils/pickImage';
import { getErrorMessage, showErrorToast, showSuccessToast } from '../../utils/toast';
import useDoctor from './useDoctor';

export default function AddCertificationForm({ navigation ,refetchData}: any) {
  const { colors,fontScale } = useTheme();
const styles = useMemo(() => getStyles(colors,fontScale), [colors,fontScale]);
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
      if (navigation.isFocused()) navigation.goBack();
    } catch (error: any) {
      showErrorToast(getErrorMessage(error, 'تعذر إضافة الشهادة.'));
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

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    label: { fontSize: 14 * fontScale, color: colors.text, fontWeight: '700', marginBottom: spacing.xs, textAlign: 'right' },
    input: { borderWidth: 1, borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, textAlign: 'right' },
    saveBtn: { backgroundColor: colors.buttonPrimary, padding: spacing.md, borderRadius: radius.md, alignItems: 'center' },
    photoBtn: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, alignItems: 'center' },
    photoBtnText: { color: colors.primary, fontWeight: '700' },
    saveBtnText: { color: colors.buttonPrimaryText, fontWeight: '900', fontSize: 16 * fontScale },
  });
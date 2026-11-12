import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ModeContext';
import { lightMode, radius, spacing } from '../../theme';
import { getErrorMessage, showErrorToast, showSuccessToast } from '../../utils/toast';
import usePatient from './usePatient';

export default function EmergencyContactForm({ navigation,refreshData }: any) {
  const { colors } = useTheme();
const styles = useMemo(() => getStyles(colors), [colors]);
  const { emergencyContactUpdate,patient, loading } = usePatient();
  const [form, setForm] = useState({
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  useEffect(() => {
    if (patient) {
      setForm({
        emergencyContactName: patient.emergencyContactName || '',
        emergencyContactPhone: patient.emergencyContactPhone || '',
      });
    }
  }, [patient]);

  const handleSave = async () => {
    try {
      await emergencyContactUpdate(form);
      showSuccessToast('تم تحديث جهة اتصال الطوارئ.');
      refreshData();
      if (navigation.isFocused()) navigation.goBack();
    } catch (error: unknown) {
      showErrorToast(getErrorMessage(error, 'تعذر تحديث جهة اتصال الطوارئ.'));
    }
  };

  if (loading && !patient) return <ActivityIndicator size="large" color={colors.primary} />;

  return (
    <View>
      <Text style={styles.label}>اسم شخص الطوارئ</Text>
      <TextInput 
        style={styles.input} 
        value={form.emergencyContactName} 
        onChangeText={(t) => setForm({ ...form, emergencyContactName: t })} 
        placeholder="أدخل الاسم"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.label}>رقم الجوال</Text>
      <TextInput 
        style={styles.input} 
        value={form.emergencyContactPhone} 
        onChangeText={(t) => setForm({ ...form, emergencyContactPhone: t })} 
        keyboardType="phone-pad" 
        placeholder="أدخل الرقم"
        placeholderTextColor={colors.textMuted}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? 'جاري الحفظ...' : 'حفظ'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors: typeof lightMode) =>
  StyleSheet.create({
    label: { fontSize: 14, color: colors.text, fontWeight: '700', marginBottom: spacing.xs, textAlign: 'right' },
    input: { borderWidth: 1, borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, textAlign: 'right' },
    saveBtn: { backgroundColor: colors.buttonPrimary, padding: spacing.md, borderRadius: radius.md, alignItems: 'center', marginTop: spacing.md },
    saveBtnText: { color: colors.buttonPrimaryText, fontWeight: '900', fontSize: 16 },
  });
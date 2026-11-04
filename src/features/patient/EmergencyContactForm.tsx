import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, spacing, radius } from '../../theme';
import usePatient from './usePatient';

export default function EmergencyContactForm({ navigation,refreshData }: any) {
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
  await emergencyContactUpdate(form);
  refreshData();
  navigation.goBack()

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

const styles = StyleSheet.create({
  label: { fontSize: 14, color: colors.primary, fontWeight: '700', marginBottom: spacing.xs, textAlign: 'right' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, textAlign: 'right' },
  saveBtn: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: radius.md, alignItems: 'center', marginTop: spacing.md },
  saveBtnText: { color: colors.gold, fontWeight: '900', fontSize: 16 },
});
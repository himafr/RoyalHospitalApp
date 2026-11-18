import { createDirectionalStyles } from '../../utils/direction';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ModeContext';
import { lightMode, radius, spacing } from '../../theme';
import { getErrorMessage, showErrorToast, showSuccessToast } from '../../utils/toast';
import usePatient from './usePatient';

export default function EmergencyContactForm({ navigation,refreshData }: any) {
  const { colors,fontScale,t, isRTL} = useTheme();
const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);
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
      showSuccessToast(t('emergency_contact_updated'), t('success'));
      refreshData();
      if (navigation.isFocused()) navigation.goBack();
    } catch (error: unknown) {
      showErrorToast(getErrorMessage(error, t('emergency_contact_update_error')), t('error'));
    }
  };

  if (loading && !patient) return <ActivityIndicator size="large" color={colors.primary} />;

  return (
    <View>
      <Text style={styles.label}>{t('emergency_contact_name')}</Text>
      <TextInput 
        style={styles.input} 
        value={form.emergencyContactName} 
        onChangeText={(t) => setForm({ ...form, emergencyContactName: t })} 
        placeholder={t('enter_name')}
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.label}>{t('phone')}
      </Text>
      <TextInput 
        style={styles.input} 
        value={form.emergencyContactPhone} 
        onChangeText={(t) => setForm({ ...form, emergencyContactPhone: t })} 
        keyboardType="phone-pad" 
        placeholder={t('enter_phone')}
        placeholderTextColor={colors.textMuted}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? t('saving') : t('save')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    label: { fontSize: 14 * fontScale, color: colors.text, fontWeight: '700', marginBottom: spacing.xs,   },
    input: { borderWidth: 1, borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md,   },
    saveBtn: { backgroundColor: colors.buttonPrimary, padding: spacing.md, borderRadius: radius.md, alignItems: 'center', marginTop: spacing.md },
    saveBtnText: { color: colors.buttonPrimaryText, fontWeight: '900', fontSize: 16 * fontScale },
  });
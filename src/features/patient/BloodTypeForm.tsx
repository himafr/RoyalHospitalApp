import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BloodType } from '../../../types/user';
import { useTheme } from '../../context/ModeContext';
import { lightMode, radius, spacing } from '../../theme';
import { getErrorMessage, showErrorToast, showSuccessToast } from '../../utils/toast';
import usePatient from './usePatient';

export default function BloodTypeForm({ navigation,refreshData }: any) {
  const { colors,fontScale } = useTheme();
const styles = useMemo(() => getStyles(colors,fontScale), [colors,fontScale]);
  const { patient, loading,bloodTypeUpdate } = usePatient();
  const [bloodType, setBloodType] = useState<BloodType>();

  useEffect(() => {
    if (patient?.bloodType) {
      setBloodType(patient.bloodType);
    }
  }, [patient]);

  const handleSave = async () => {
     if (!bloodType) return;
    try {
      await bloodTypeUpdate(bloodType);
      showSuccessToast('تم تحديث فصيلة الدم.');
      refreshData();
      if (navigation.isFocused()) navigation.goBack();
    } catch (error: unknown) {
      showErrorToast(getErrorMessage(error, 'تعذر تحديث فصيلة الدم.'));
    }

  };

  if (loading && !patient) return <ActivityIndicator size="large" color={colors.primary} />;

  return (
    <View>
      <Text style={styles.label}>فصيلة الدم</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={bloodType} onValueChange={(v) => setBloodType(v)} style={styles.picker}>
          <Picker.Item label="A+" value="A_PLUS" />
          <Picker.Item label="A-" value="A_MINUS" />
          <Picker.Item label="B+" value="B_PLUS" />
          <Picker.Item label="B-" value="B_MINUS" />
          <Picker.Item label="AB+" value="AB_PLUS" />
          <Picker.Item label="AB-" value="AB_MINUS" />
          <Picker.Item label="O+" value="O_PLUS" />
          <Picker.Item label="O-" value="O_MINUS" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? 'جاري الحفظ...' : 'حفظ'}</Text>
      </TouchableOpacity>
    </View>
  );
}
const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    label: { fontSize: 14 * fontScale, color: colors.text, fontWeight: '700', marginBottom: spacing.sm, textAlign: 'right' },
    pickerWrapper: { borderWidth: 1, borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, borderRadius: radius.md, marginBottom: spacing.lg, overflow: 'hidden' },
    picker: { color: colors.text },
    saveBtn: { backgroundColor: colors.buttonPrimary, padding: spacing.md, borderRadius: radius.md, alignItems: 'center' },
    saveBtnText: { color: colors.buttonPrimaryText, fontWeight: '900', fontSize: 16 * fontScale },
  });
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BloodType } from '../../../types/user';
import { colors, radius, spacing } from '../../theme';
import usePatient from './usePatient';

export default function BloodTypeForm({ navigation,refreshData }: any) {
  const { patient, loading,bloodTypeUpdate } = usePatient();
  const [bloodType, setBloodType] = useState<BloodType>();

  useEffect(() => {
    if (patient?.bloodType) {
      setBloodType(patient.bloodType);
    }
  }, [patient]);

  const handleSave = async () => {
     if (!bloodType) return;
    await bloodTypeUpdate(bloodType);
    refreshData();
    navigation.goBack();

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

const styles = StyleSheet.create({
  label: { fontSize: 14, color: colors.primary, fontWeight: '700', marginBottom: spacing.sm, textAlign: 'right' },
  pickerWrapper: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, marginBottom: spacing.lg, overflow: 'hidden' },
  picker: { color: colors.primary },
  saveBtn: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  saveBtnText: { color: colors.gold, fontWeight: '900', fontSize: 16 },
});
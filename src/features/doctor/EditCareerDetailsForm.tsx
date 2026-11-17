import { createDirectionalStyles } from '../../utils/direction';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ModeContext';
import { lightMode, radius, spacing } from '../../theme';
import { getErrorMessage, showErrorToast, showSuccessToast } from '../../utils/toast';
import useDoctor from './useDoctor';

export default function EditCareerDetailsForm({
  navigation,
  refetchData,
}: any) {
  const { colors,fontScale,t, isRTL} = useTheme();
const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);
  const { doctor: user, loading, editDoctorCareer } = useDoctor();
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
    try {
      await editDoctorCareer({ data: form });
      await refetchData();
      showSuccessToast(t('career_update_success'), t('success'));
      if (navigation.isFocused()) navigation.goBack();
    } catch (error: unknown) {
      showErrorToast(getErrorMessage(error, t('career_update_error')), t('error'));
    }
  };

  if (loading && !user)
    return <ActivityIndicator size="large" color={colors.primary} />;

  return (
    <View>
      <Text style={styles.label}>{t('specialty')}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={form.specialty}
          onValueChange={v => setForm({ ...form, specialty: v })}
        >
          <Picker.Item label={t('spec_general')} value="GENERAL" />
          <Picker.Item label={t('spec_dentistry')} value="DENTISTRY" />
          <Picker.Item label={t('spec_dermatology')} value="DERMATOLOGY" />
          <Picker.Item label={t('spec_ophthalmology')} value="OPHTHALMOLOGY" />
          <Picker.Item label={t('spec_cardiology')} value="CARDIOLOGY" />
          <Picker.Item label={t('spec_cosmetic_dermatology')} value="COSMETIC_DERMATOLOGY" />
          <Picker.Item label={t('spec_pediatrics')} value="PEDIATRICS" />
          <Picker.Item label={t('spec_family_medicine')} value="FAMILY_MEDICINE" />
        </Picker>
      </View>

      <Text style={styles.label}>{t('job_title')}</Text>
      <TextInput
        style={styles.input}
        value={form.specialization}
        onChangeText={t => setForm({ ...form, specialization: t })}
      />

      <Text style={styles.label}>{t('memberships')}</Text>
      <TextInput
        style={styles.input}
        value={form.work}
        onChangeText={t => setForm({ ...form, work: t })}
      />

      <Text style={styles.label}>{t('about_doctor')}</Text>
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
        <Text style={styles.saveBtnText}>{loading ? t('saving') : t('save_changes')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    label: {
      fontSize: 14 * fontScale,
      color: colors.text,
      fontWeight: '700',
      marginBottom: spacing.xs,
      textAlign: 'right',
    },
    input: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBackground,
      color: colors.text,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      textAlign: 'right',
    },
    pickerWrapper: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBackground,
      borderRadius: radius.md,
      marginBottom: spacing.md,
      overflow: 'hidden',
    },
    saveBtn: {
      backgroundColor: colors.buttonPrimary,
      padding: spacing.md,
      borderRadius: radius.md,
      alignItems: 'center',
    },
    saveBtnText: {
      color: colors.buttonPrimaryText,
      fontWeight: '900',
      fontSize: 16 * fontScale,
    },
  });
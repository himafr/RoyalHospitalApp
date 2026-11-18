import { createDirectionalStyles } from '../../utils/direction';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Asset } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ModeContext';
import { lightMode, radius, spacing } from '../../theme';
import { pickImage } from '../../utils/pickImage';
import {
  getErrorMessage,
  showErrorToast,
  showSuccessToast,
} from '../../utils/toast';
import useDoctor from './useDoctor';

export default function EditCertificationForm({
  certId: id,
  navigation,
  refetchData,
}: any) {
  const { colors,fontScale,t, isRTL} = useTheme();
const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);
  const {
    doctor,
    loading,
    getCertificationById,
    editCertification,
    deleteCertificationById,
  } = useDoctor();

  const [form, setForm] = useState({
    name: '',
    place: '',
    organization: '',
  });
  const [photo, setPhoto] = useState<Asset | null>(null);

  useEffect(() => {
    const cert = getCertificationById(id);
    if (cert) {
      setForm({
        name: cert.name || '',
        organization: cert.organization || '',
        place: cert.place || '',
      });
    }
  }, [doctor, getCertificationById, id]);

  const handleSave = async () => {
    try {
      await editCertification({ id, fData: form, photo });
      await refetchData();
      showSuccessToast(t('certification_update_success'), t('success'));
      if (navigation.isFocused()) navigation.goBack();
    } catch (error: any) {
      showErrorToast(getErrorMessage(error, t('certification_update_error')), t('error'));
    }
  };

  const handlePickPhoto = async () => {
    try {
      const selectedPhoto = await pickImage();
      if (selectedPhoto) setPhoto(selectedPhoto);
    } catch (error: unknown) {
      showErrorToast(getErrorMessage(error, t('certification_photo_error')), t('error'));
    }
  };

  const handleDelete = async () => {
    Alert.alert(t('delete_confirm'), t('delete_cert_confirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCertificationById(id);
            await refetchData();
            showSuccessToast(t('certification_delete_success'), t('success'));
            if (navigation.isFocused()) navigation.goBack();
          } catch (error: any) {
            showErrorToast(getErrorMessage(error, t('certification_delete_error')), t('error'));
          }
        },
      },
    ]);
  };

  if (loading && !doctor) return <ActivityIndicator />;

  return (
    <View>
      <Text style={styles.label}>{t('cert_name')}</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={t => setForm({ ...form, name: t })}
      />

      <Text style={styles.label}>{t('cert_organization')}</Text>
      <TextInput
        style={styles.input}
        value={form.organization}
        onChangeText={t => setForm({ ...form, organization: t })}
      />

      <Text style={styles.label}>{t('cert_place')}</Text>
      <TextInput
        style={styles.input}
        value={form.place}
        onChangeText={t => setForm({ ...form, place: t })}
      />

      <TouchableOpacity style={styles.photoBtn} onPress={handlePickPhoto}>
        <Text style={styles.photoBtnText}>
          {photo?.fileName || `${t('replace_photo')} (${t('optional')})`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveBtnText}>
          {loading ? t('saving') : t('save_changes')}
        </Text>
      </TouchableOpacity>

      {/* زرار الحذف */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Ionicons name="trash" size={20} color={colors.iconSecondary} />
        <Text style={styles.deleteBtnText}>{t('delete_cert')}</Text>
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
       
    },
    input: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBackground,
      color: colors.text,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
       
    },
    saveBtn: {
      backgroundColor: colors.buttonPrimary,
      padding: spacing.md,
      borderRadius: radius.md,
      alignItems: 'center',
    },
    photoBtn: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      alignItems: 'center',
    },
    photoBtnText: { color: colors.primary, fontWeight: '700' },
    saveBtnText: {
      color: colors.buttonPrimaryText,
      fontWeight: '900',
      fontSize: 16 * fontScale,
    },
    deleteBtn: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.error,
      padding: spacing.md,
      borderRadius: radius.md,
      marginTop: spacing.md,
      gap: spacing.sm,
    },
    deleteBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 * fontScale },
  });
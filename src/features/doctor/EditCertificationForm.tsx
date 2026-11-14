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
  const { colors,fontScale } = useTheme();
const styles = useMemo(() => getStyles(colors,fontScale), [colors,fontScale]);
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
      showSuccessToast('تم تحديث الشهادة.');
      if (navigation.isFocused()) navigation.goBack();
    } catch (error: any) {
      showErrorToast(getErrorMessage(error, 'تعذر تحديث الشهادة.'));
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

  const handleDelete = async () => {
    Alert.alert('تأكيد الحذف', 'هل أنت متأكد أنك تريد حذف هذه الشهادة؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCertificationById(id);
            await refetchData();
            showSuccessToast('تم حذف الشهادة.');
            if (navigation.isFocused()) navigation.goBack();
          } catch (error: any) {
            showErrorToast(getErrorMessage(error, 'تعذر حذف الشهادة.'));
          }
        },
      },
    ]);
  };

  if (loading && !doctor) return <ActivityIndicator />;

  return (
    <View>
      <Text style={styles.label}>اسم الشهادة</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={t => setForm({ ...form, name: t })}
      />

      <Text style={styles.label}>الجهة المانحة</Text>
      <TextInput
        style={styles.input}
        value={form.organization}
        onChangeText={t => setForm({ ...form, organization: t })}
      />

      <Text style={styles.label}>المكان</Text>
      <TextInput
        style={styles.input}
        value={form.place}
        onChangeText={t => setForm({ ...form, place: t })}
      />

      <TouchableOpacity style={styles.photoBtn} onPress={handlePickPhoto}>
        <Text style={styles.photoBtnText}>
          {photo?.fileName || 'استبدال صورة الشهادة (اختياري)'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveBtnText}>
          {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
        </Text>
      </TouchableOpacity>

      {/* زرار الحذف */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Ionicons name="trash" size={20} color={colors.iconSecondary} />
        <Text style={styles.deleteBtnText}>حذف الشهادة</Text>
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
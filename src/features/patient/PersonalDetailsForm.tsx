import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Asset } from 'react-native-image-picker';
import { useTheme } from '../../context/ModeContext';
import useUser from '../../hooks/useUser';
import { lightMode, radius, spacing } from '../../theme';
import { pickImage } from '../../utils/pickImage';
import { getErrorMessage, showErrorToast, showSuccessToast } from '../../utils/toast';

export default function PersonalDetailsForm({ navigation, refreshData }: any) {
  const { colors,fontScale } = useTheme();
const styles = useMemo(() => getStyles(colors,fontScale), [colors,fontScale]);
  const { data: user, updatePersonalDetails, loading } = useUser();
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photo, setPhoto] = useState<Asset | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    user?.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
  );

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
      });
    }
  }, [user]);

  async function handleSave() {
    try {
      await updatePersonalDetails(form, photo);
      showSuccessToast('تم تحديث بياناتك الشخصية.');
      refreshData();
      if (navigation.isFocused()) navigation.goBack();
    } catch (error: unknown) {
      showErrorToast(getErrorMessage(error, 'تعذر تحديث بياناتك الشخصية.'));
    }
  }

  const handlePickPhoto = async () => {
    try {
      const selectedPhoto = await pickImage();
      if (selectedPhoto) setPhoto(selectedPhoto);
    } catch (error: unknown) {
      showErrorToast(getErrorMessage(error, 'تعذر اختيار الصورة.'));
    };
  };
  // ✨ دالة التعامل مع اختيار التاريخ
  const onChangeDate = (event: any, date?: Date) => {
    // في الأندرويد، بنقفل الـ Picker بعد ما يختار
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      // بنحول التاريخ لصيغة YYYY-MM-DD عشان تتبعت للسيرفر
      const formattedDate = date.toISOString().split('T')[0];
      setForm({ ...form, dateOfBirth: formattedDate });
    }
  };
  if (loading && !user) return <ActivityIndicator />;
  return (
    <View>
      <TouchableOpacity style={styles.photoBtn} onPress={handlePickPhoto}>
        <Text style={styles.photoBtnText}>
          {photo?.fileName || 'اختيار صورة شخصية'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>الاسم بالكامل</Text>
      <TextInput
        style={styles.input}
        value={form.fullName}
        onChangeText={t => setForm({ ...form, fullName: t })}
      />

      <Text style={styles.label}>رقم الجوال</Text>
      <TextInput
        style={styles.input}
        value={form.phoneNumber}
        onChangeText={t => setForm({ ...form, phoneNumber: t })}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>تاريخ الميلاد</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text
          style={{
            color: form.dateOfBirth ? colors.primary : colors.textMuted,
            textAlign: 'right',
          }}
        >
          {form.dateOfBirth || 'اختر تاريخ الميلاد'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 12))}
        />
      )}

      <Text style={styles.label}>الجنس</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={form.gender}
          onValueChange={v => setForm({ ...form, gender: v })}
        >
          <Picker.Item label="ذكر" value="ذكر" />
          <Picker.Item label="أنثى" value="انثي" />
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveBtnText}>
          {loading ? 'جاري الحفظ...' : 'حفظ'}
        </Text>
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
  });
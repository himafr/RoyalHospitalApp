import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PasswordInput from '../../components/PasswordInput';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ModeContext';
import useUser from '../../hooks/useUser';
import { lightMode, radius, spacing } from '../../theme';
import { getErrorMessage, showErrorToast } from '../../utils/toast';

export default function ChangePasswordForm({ navigation }: any) {
  const { colors } = useTheme();
const styles = useMemo(() => getStyles(colors), [colors]);
  const { signOut } = useAuth();
  const { passwordUpdate, loading } = useUser();

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSave = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      return Alert.alert('', 'يرجى ملء جميع الحقول');
    }
    if (newPass !== confirmPass) {
      return Alert.alert('', 'كلمة المرور الجديدة غير متطابقة');
    }
    if (newPass.length < 6) {
      return Alert.alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    }
    try {
      const res = await passwordUpdate({ newPass, oldPass });
      if (res !== 200) return;
    } catch (error: unknown) {
      showErrorToast(getErrorMessage(error, 'تعذر تحديث كلمة المرور.'));
      return;
    }

    Alert.alert(
      'تم التحديث',
      'تم تغيير كلمة المرور بنجاح. هل تريد تسجيل الخروج الآن أم البقاء؟',
      [
        {
          text: 'تسجيل الخروج',
          onPress: () => signOut(),
          style: 'destructive', // لون أحمر عشان يوضح إنه خروج
        },
        {
          text: 'البقاء',
          onPress: () =>{if (navigation.isFocused()) navigation.goBack();}
            , // نقفل الـ Modal ونرجع للـ Home
          style: 'cancel',
        },
      ],
      { cancelable: false }, // عشان ميقدرش يقفل الـ Alert من بره
    );
  };

  return (
    <View>
      <Text style={styles.label}>كلمة المرور الحالية</Text>
      <PasswordInput
        value={oldPass}
        onChangeText={setOldPass}
        placeholder="أدخل كلمة المرور الحالية"
      />

      <Text style={styles.label}>كلمة المرور الجديدة</Text>
      <PasswordInput
        value={newPass}
        onChangeText={setNewPass}
        placeholder="أدخل كلمة المرور الجديدة"
      />

      <Text style={styles.label}>تأكيد كلمة المرور الجديدة</Text>
      <PasswordInput
        value={confirmPass}
        onChangeText={setConfirmPass}
        placeholder="أعد كتابة كلمة المرور الجديدة"
      />

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.saveBtnText}>تحديث كلمة المرور</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors: typeof lightMode) =>
  StyleSheet.create({
    label: {
      fontSize: 14,
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
      justifyContent: 'center',
      minHeight: 52,
    },
    saveBtnText: {
      color: colors.buttonPrimaryText,
      fontWeight: '900',
      fontSize: 16,
    },
  });
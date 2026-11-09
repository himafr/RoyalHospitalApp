import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import useUser from '../../hooks/useUser';
import { colors, radius, spacing } from '../../theme';
import PasswordInput from '../../components/PasswordInput';
import { getErrorMessage, showErrorToast } from '../../utils/toast';

export default function ChangePasswordForm({ navigation }: any) {
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
          <ActivityIndicator color={colors.gold} />
        ) : (
          <Text style={styles.saveBtnText}>تحديث كلمة المرور</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    textAlign: 'right',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  saveBtnText: { color: colors.gold, fontWeight: '900', fontSize: 16 },
});

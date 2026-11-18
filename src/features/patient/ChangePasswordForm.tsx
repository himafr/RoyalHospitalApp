import { createDirectionalStyles } from '../../utils/direction';
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
  const { colors,fontScale,t, isRTL} = useTheme();
const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);
  const { signOut } = useAuth();
  const { passwordUpdate, loading } = useUser();

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSave = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      return Alert.alert('', t('fill_all_fields'));
    }
    if (newPass !== confirmPass) {
      return Alert.alert('', t('passwords_not_match'));
    }
    if (newPass.length < 6) {
      return Alert.alert(t('password_min_length'));
    }
    try {
      const res = await passwordUpdate({ newPass, oldPass });
      if (res !== 200) return;
    } catch (error: unknown) {
      showErrorToast(getErrorMessage(error, t('password_update_error')), t('error'));
      return;
    }

    Alert.alert(
      t('password_updated'),
      t('password_update_success'),
      [
        {
          text: t('logout'),
          onPress: () => signOut(),
          style: 'destructive', // لون أحمر عشان يوضح إنه خروج
        },
        {
          text: t('stay'),
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
      <Text style={styles.label}>{t('current_password')}</Text>
      <PasswordInput
        value={oldPass}
        onChangeText={setOldPass}
        placeholder={t('enter_current_password')}
      />

      <Text style={styles.label}>{t('new_password')}</Text>
      <PasswordInput
        value={newPass}
        onChangeText={setNewPass}
        placeholder={t('enter_new_password')}
      />

      <Text style={styles.label}>{t('confirm_new_password')}</Text>
      <PasswordInput
        value={confirmPass}
        onChangeText={setConfirmPass}
        placeholder={t('reenter_new_password')}
      />

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.saveBtnText}>{t('update_password_btn')}</Text>
        )}
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
      justifyContent: 'center',
      minHeight: 52,
    },
    saveBtnText: {
      color: colors.buttonPrimaryText,
      fontWeight: '900',
      fontSize: 16 * fontScale,
    },
  });
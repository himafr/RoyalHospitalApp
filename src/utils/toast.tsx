import React, { useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast, { type ToastConfig } from 'react-native-toast-message';
import { useTheme } from '../context/ModeContext';
import { lightMode, radius, spacing } from '../theme';

type ToastProps = { text1?: string; text2?: string };

function BaseToast({
  text1,
  text2,
  variant,
}: ToastProps & { variant: 'success' | 'error' }) {
  const { colors,fontScale } = useTheme();
  const styles = useMemo(() => getStyles(colors,fontScale), [colors,fontScale]);

  const isSuccess = variant === 'success';
  const accent = isSuccess ? colors.success : colors.error;

  return (
    <View style={[styles.container, { borderRightColor: accent }]}>
      <Ionicons
        name={isSuccess ? 'checkmark-circle' : 'alert-circle'}
        size={24}
        color={accent}
        style={styles.icon}
      />
      <View style={styles.copy}>
        {text1 ? <Text style={styles.title}>{text1}</Text> : null}
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </View>
  );
}

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <BaseToast variant="success" text1={text1} text2={text2} />
  ),
  error: ({ text1, text2 }) => (
    <BaseToast variant="error" text1={text1} text2={text2} />
  ),
};

export function showSuccessToast(message: string, title = 'تم بنجاح') {
  Toast.show({ type: 'success', text1: title, text2: message });
}

export function showErrorToast(message: string, title = 'تعذر إكمال العملية') {
  Toast.show({ type: 'error', text1: title, text2: message });
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null) {
    const response = (error as {
      response?: { data?: { message?: unknown } };
    }).response;
    const message = response?.data?.message;
    if (typeof message === 'string' && message.trim()) return message;
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: colors.modal,
      borderRadius: radius.md,
      borderRightWidth: 4,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginHorizontal: spacing.md,
      minHeight: 64,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    icon: { marginLeft: spacing.md },
    copy: { flex: 1 },
    title: {
      color: colors.text,
      fontSize: 16 * fontScale,
      fontWeight: '700',
      textAlign: 'right',
    },
    message: {
      color: colors.textSecondary,
      fontSize: 14 * fontScale,
      lineHeight: 21,
      marginTop: spacing.xs,
      textAlign: 'right',
    },
  });
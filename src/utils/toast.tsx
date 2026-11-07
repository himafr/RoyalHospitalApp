import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast, { type ToastConfig } from 'react-native-toast-message';
import { colors, radius, spacing } from '../theme';

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <View style={[styles.container, styles.success]}>
      <Ionicons
        name="checkmark-circle"
        size={24}
        color={colors.primary}
        style={styles.icon}
      />
      <View style={styles.copy}>
        {text1 ? <Text style={styles.title}>{text1}</Text> : null}
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={[styles.container, styles.error]}>
      <Ionicons
        name="alert-circle"
        size={24}
        color={colors.danger}
        style={styles.icon}
      />
      <View style={styles.copy}>
        {text1 ? <Text style={styles.title}>{text1}</Text> : null}
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </View>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderRightWidth: 4,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    minHeight: 64,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  success: { borderRightColor: colors.primary },
  error: { borderRightColor: colors.danger },
  icon: { marginLeft: spacing.md },
  copy: { flex: 1 },
  title: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
  },
  message: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
});

import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ModeContext';
import { lightMode, spacing } from '../theme';
import PrimaryButton from './PrimaryButton';

interface Props {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: Props) {
  const { colors,fontScale,t } = useTheme();
const styles = useMemo(() => getStyles(colors,fontScale), [colors,fontScale]);
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={32} color={colors.textMuted} />
      <Text style={styles.title}>{t("load_error")}</Text>
      <Text style={styles.message}>{message}</Text>
      <PrimaryButton title={t("retry")} onPress={onRetry} />
    </View>
  );
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      padding: spacing.lg,
      gap: spacing.sm,
    },
    title: {
      color: colors.text,
      fontSize: 16 * fontScale,
      fontWeight: '700',
      textAlign: 'center',
    },
    message: {
      color: colors.textSecondary,
      fontSize: 14 * fontScale,
      lineHeight: 21,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
  });
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ModeContext';
import { lightMode, radius, spacing } from '../theme';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Icon.glyphMap;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
}

export default function PrimaryButton({ title, onPress, loading, disabled, icon, variant = 'primary', style }: Props) {
  const { colors,fontScale } = useTheme();
const styles = useMemo(() => getStyles(colors,fontScale), [colors,fontScale]);
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      style={[styles.button, isPrimary ? styles.primary : styles.secondary, (disabled || loading) && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.primary : colors.primaryLight} />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary]}>{title}</Text>
          {icon ? <Icon name={icon} size={20} color={isPrimary ? colors.primary : colors.primaryLight} style={{ marginRight: spacing.sm }} /> : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    button: { height: 52, borderRadius: radius.lg, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.lg, width: '100%' },
    primary: { backgroundColor: colors.buttonPrimary },
    secondary: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
    disabled: { opacity: 0.6 },
    content: { flexDirection: 'row', alignItems: 'center' },
    text: { fontSize: 16 * fontScale, fontWeight: '900' },
    textPrimary: { color: colors.buttonPrimaryText },
    textSecondary: { color: colors.text },
  });
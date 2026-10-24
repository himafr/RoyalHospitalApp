import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, radius, spacing } from '../theme';

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
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      style={[styles.button, isPrimary ? styles.primary : styles.secondary, (disabled || loading) && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.gold : colors.primary} />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary]}>{title}</Text>
          {icon ? <Icon name={icon} size={20} color={isPrimary ? colors.gold : colors.primary} style={{ marginRight: spacing.sm }} /> : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { height: 52, borderRadius: radius.lg, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.lg, width: '100%' },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.goldBorder },
  disabled: { opacity: 0.6 },
  content: { flexDirection: 'row-reverse', alignItems: 'center' },
  text: { fontSize: 16, fontWeight: '900' },
  textPrimary: { color: colors.gold },
  textSecondary: { color: colors.primary },
});
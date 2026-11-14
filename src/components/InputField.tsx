import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ModeContext';
import { lightMode, radius, spacing } from '../theme';

interface Props extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: keyof typeof Icon.glyphMap;
  error?: string;
}

export default function InputField({ label, value, onChangeText, icon, error, secureTextEntry, ...rest }: Props) {
   const { colors,fontScale } = useTheme();
  const styles = useMemo(() => getStyles(colors,fontScale), [colors,fontScale]);
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(!secureTextEntry);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, focused && styles.focused, error && styles.errorBorder]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={!show}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {secureTextEntry ? (
          <TouchableOpacity onPress={() => setShow(!show)} style={styles.icon}>
            <Icon name={show ? 'eye-off' : 'eye'} size={20} color={colors.gold} />
          </TouchableOpacity>
        ) : icon ? (
          <View style={styles.icon}>
            <Icon name={icon} size={18} color={colors.gold} />
          </View>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    container: { marginBottom: spacing.md, width: '100%' },
    label: { fontSize: 12 * fontScale, color: colors.textMuted, letterSpacing: 0.6, marginBottom: spacing.xs },
    inputWrap: {
      flexDirection: 'row', alignItems: 'center', borderWidth: 1,
      borderColor: colors.inputBorder, borderRadius: radius.md, backgroundColor: colors.inputBackground,
      paddingHorizontal: spacing.md, height: 52,
    },
    focused: { borderColor: colors.inputBorderFocused },
    errorBorder: { borderColor: colors.error },
    input: { flex: 1, fontSize: 16 * fontScale, color: colors.text, textAlign: 'right', paddingVertical: 0 },
    icon: { paddingHorizontal: spacing.sm },
    errorText: { color: colors.error, fontSize: 12 * fontScale, marginTop: spacing.xs, textAlign: 'right' },
  });
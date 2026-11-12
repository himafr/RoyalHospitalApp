import React, { useMemo, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ModeContext';
import { lightMode, radius, spacing } from '../theme';

interface Props extends TextInputProps {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
}

export default function PasswordInput({ value, onChangeText, placeholder, ...rest }: Props) {
  const { colors } = useTheme();
const styles = useMemo(() => getStyles(colors), [colors]);
  const [show, setShow] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!show}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        {...rest}
      />
      <TouchableOpacity onPress={() => setShow(!show)} style={styles.iconBtn}>
        <Ionicons 
          name={show ? 'eye-off' : 'eye'} 
          size={22} 
          color={colors.primary} 
        />
      </TouchableOpacity>
    </View>
  );
}
const getStyles = (colors: typeof lightMode) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: radius.md,
      marginBottom: spacing.md,
      backgroundColor: colors.inputBackground,
    },
    input: {
      flex: 1,
      padding: spacing.md,
      textAlign: 'right',
      color: colors.text,
    },
    iconBtn: {
      paddingHorizontal: spacing.md,
    },
  });

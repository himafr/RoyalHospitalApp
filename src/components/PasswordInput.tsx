import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, spacing, radius } from '../theme';

interface Props extends TextInputProps {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
}

export default function PasswordInput({ value, onChangeText, placeholder, ...rest }: Props) {
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
          color={colors.gold} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    padding: spacing.md,
    textAlign: 'right',
    color: colors.primary,
  },
  iconBtn: {
    paddingHorizontal: spacing.md,
  },
});
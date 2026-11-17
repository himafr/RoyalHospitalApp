import { createDirectionalStyles } from '../utils/direction';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SPECIALTIES, SPECIALTY_TRANSLATION_KEYS } from '../constants';
import { useTheme } from '../context/ModeContext';
import { lightMode, radius, spacing } from '../theme';
import SmoothScrollView from './SmoothScrollView';

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

export default function FilterChips({ selected, onSelect }: Props) {
  const { colors,fontScale,t, isRTL} = useTheme();
const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);
  return (
    <SmoothScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[styles.chip, selected === '' && styles.chipActive]}
        onPress={() => onSelect('')}
      >
        <Text style={[styles.text, selected === '' && styles.textActive]}>
          {t('all')}
        </Text>
      </TouchableOpacity>
      {SPECIALTIES.map(spec => (
        <TouchableOpacity
          key={spec.id}
          style={[styles.chip, selected === spec.id && styles.chipActive]}
          onPress={() => onSelect(spec.id)}
        >
          <Text
            style={[styles.text, selected === spec.id && styles.textActive]}
          >
            {t(SPECIALTY_TRANSLATION_KEYS[spec.id])}
          </Text>
        </TouchableOpacity>
      ))}
    </SmoothScrollView>
  );
}
const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.sm,
      flexDirection: 'row',
      height: 50,
    },
    chip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      marginRight: spacing.sm,
      minWidth: 80,
      height: 30,
      alignItems: 'center',
    },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    text: { color: colors.text, fontWeight: '700', fontSize: 13 * fontScale },
    textActive: { color: colors.onPrimary },
  });
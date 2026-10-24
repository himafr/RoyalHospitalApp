import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SPECIALTIES } from '../constants';
import { colors, spacing, radius } from '../theme';

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

export default function FilterChips({ selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={[styles.chip, selected === '' && styles.chipActive]}
        onPress={() => onSelect('')}
      >
        <Text style={[styles.text, selected === '' && styles.textActive]}>الكل</Text>
      </TouchableOpacity>
      {SPECIALTIES.map((spec) => (
        <TouchableOpacity
          key={spec.id}
          style={[styles.chip, selected === spec.id && styles.chipActive]}
          onPress={() => onSelect(spec.id)}
        >
          <Text style={[styles.text, selected === spec.id && styles.textActive]}>{spec.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm, flexDirection: 'row' },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  textActive: { color: colors.gold },
});
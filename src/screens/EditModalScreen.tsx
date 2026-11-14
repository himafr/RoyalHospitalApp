import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import SmoothScrollView from '../components/SmoothScrollView';
import { useTheme } from '../context/ModeContext';
import { lightMode, spacing } from '../theme';

export default function EditModalScreen({ route, navigation }: any) {
  const { colors,fontScale } = useTheme();
const styles = useMemo(() => getStyles(colors,fontScale), [colors,fontScale]);
  const { renderContent } = route.params;

  return (
    <SmoothScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        {renderContent ? renderContent(navigation) : null}
      </View>
    </SmoothScrollView>
  );
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md },
    card: {
      backgroundColor: colors.card,
      padding: spacing.lg,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  });
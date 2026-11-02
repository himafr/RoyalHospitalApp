import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing } from '../theme';

export default function EditModalScreen({ route, navigation }: any) {
  const { renderContent } = route.params;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        {renderContent ? renderContent(navigation) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgLight },
  content: { padding: spacing.md },
  card: { backgroundColor: colors.white, padding: spacing.lg, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
});
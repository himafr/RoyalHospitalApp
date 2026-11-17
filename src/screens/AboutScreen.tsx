import { createDirectionalStyles } from '../utils/direction';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // تأكد من طريقة الاستيراد اللي ظبطتها
import SmoothScrollView from '../components/SmoothScrollView';
import { useTheme } from '../context/ModeContext';
import { lightMode, radius, shadow, spacing } from '../theme';
import NavBar from '../components/layout/NavBar';

export default function AboutScreen({navigation}:any) {
  const { colors,fontScale,t, isRTL} = useTheme();
const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);
  return (
    <SmoothScrollView style={styles.root}>
      <NavBar navigation={navigation} title={t('clinic_about')} />
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{t('app_name')}</Text>
        <Text style={styles.heroSub}>{t('about_desc')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('our_message')}</Text>
        <View style={styles.card}>
          <Ionicons name="globe-outline" size={32} color={colors.primary} />
          <Text style={styles.cardText}>
            {t('our_message_desc')}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>{t('our_vision')}</Text>
        <View style={styles.card}>
          <Ionicons name="eye-outline" size={32} color={colors.primary} />
          <Text style={styles.cardText}>
            {t('our_vision_desc')}
          </Text>
        </View>
      </View>
      <View style={{height:100}}/>
    </SmoothScrollView>
  );
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    hero: {
      padding: spacing.xxl,
      backgroundColor: colors.primary,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      alignItems: 'center',
    },
    heroTitle: { fontSize: 32 * fontScale, fontWeight: '900', color: colors.onPrimary, textAlign: 'center' },
    heroSub: { fontSize: 16 * fontScale, color: colors.onPrimary, opacity: 0.8, textAlign: 'center', marginTop: spacing.sm },
    section: { padding: spacing.lg },
    sectionTitle: { fontSize: 22 * fontScale, fontWeight: '900', color: colors.text, textAlign: 'right', marginTop: spacing.md, marginBottom: spacing.sm },
    card: {
      backgroundColor: colors.card,
      padding: spacing.lg,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
      ...shadow.card,
    },
    cardText: { fontSize: 15 * fontScale, color: colors.textSecondary, lineHeight: 24, marginTop: spacing.md, textAlign: 'right' },
  });
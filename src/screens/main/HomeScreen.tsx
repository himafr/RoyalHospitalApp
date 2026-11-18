import { createDirectionalStyles } from '../../utils/direction';
import React, { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SmoothScrollView from '../../components/SmoothScrollView';
import VerifyMessage from '../../components/VerifyMessage';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ModeContext';
import { lightMode, radius, shadow, spacing } from '../../theme';
import AppHeader from '../../components/layout/AppHeader';

const features = [
  {
    icon: 'hardware-chip-outline',
    titleKey: 'feature_equipment_title',
    descKey: 'feature_equipment_desc',
  },
  {
    icon: 'people-outline',
    titleKey: 'feature_team_title',
    descKey: 'feature_team_desc',
  },
  {
    icon: 'document-text-outline',
    titleKey: 'feature_followup_title',
    descKey: 'feature_followup_desc',
  },
  {
    icon: 'alarm-outline',
    titleKey: 'feature_reminder_title',
    descKey: 'feature_reminder_desc',
  },
] as const;

const services = [
  {
    icon: 'medkit-outline',
    titleKey: 'service_consultation',
    descKey: 'service_consultation_desc',
  },
  {
    icon: 'flask-outline',
    titleKey: 'service_procedures',
    descKey: 'service_procedures_desc',
  },
  {
    icon: 'refresh-circle-outline',
    titleKey: 'service_followup',
    descKey: 'service_followup_desc',
  },
  {
    icon: 'fitness-outline',
    titleKey: 'service_programs',
    descKey: 'service_programs_desc',
  },
] as const;

const testimonials = [
  {
    name: 'أحمد المحمدي',
    textKey: 'home_testimonial_one',
  },
  {
    name: 'سارة العتيبي',
    textKey: 'home_testimonial_two',
  },
  {
    name: 'خالد الفيصل',
    textKey: 'home_testimonial_three',
  },
] as const;

export default function PatientHomeScreen({ navigation }: any) {
  const { colors,fontScale,t, isRTL} = useTheme();
const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);
  const { isVerified , signOut} = useAuth();
  return (
    <SmoothScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <AppHeader />

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          {t('home_title_1')}
          <Text style={{ color: colors.primary }}>{t('home_title_2')}</Text>
        </Text>
        <Text style={styles.heroSub}>{t('home_desc')}</Text>

        <View style={styles.heroBtns}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('AppointmentTab')}
          >
            <Text style={styles.btnPrimaryText}>{t('book_now')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => navigation.navigate('About')}
          >
            <Text style={styles.btnSecondaryText}>{t('know_us')}</Text>
          </TouchableOpacity>
        </View>

        {/* التقييم والصور الرمزية */}
        <View style={styles.ratingRow}>
          <View style={styles.avatarGroup}>
            {[1, 2, 3].map(i => (
              <View key={i} style={styles.avatarMini}>
                <Ionicons name="person" size={14} color={colors.primary} />
              </View>
            ))}
          </View>
          <View style={{ alignItems: 'flex-start' }}>
            <View style={{ flexDirection: 'row' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <Ionicons key={i} name="star" size={12} color={colors.primary} />
              ))}
            </View>
            <Text style={styles.ratingText}>{t('happy_patients')}</Text>
          </View>
        </View>
      </View>

      {/* 3. لماذا تختار عيادتنا؟ (Features) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('why_choose_us')}</Text>
        <Text style={styles.sectionSub}>{t('why_choose_us_desc')}</Text>

        <FlatList
          data={features}
          scrollEnabled={false}
          keyExtractor={i => i.titleKey}
          renderItem={({ item }) => (
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>{t(item.titleKey)}</Text>
                <Text style={styles.featureDesc}>{t(item.descKey)}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* 4. خدماتنا الطبية (Services) */}
      <View style={[styles.section, { backgroundColor: colors.backgroundAlt }]}>
        <View style={styles.servicesHeader}>
          <Text style={styles.sectionTitle}>{t('our_services')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ServicesTab')}>
            <Text style={styles.linkText}>{t('view_all_services')}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionSub}>
          {t('services_under_one_roof')}
        </Text>

        <FlatList
          data={services}
          scrollEnabled={false}
          keyExtractor={i => i.titleKey}
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <View style={styles.serviceIconBox}>
                <Ionicons
                  name={item.icon as any}
                  size={28}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.serviceTitle}>{t(item.titleKey)}</Text>
              <Text style={styles.serviceDesc}>{t(item.descKey)}</Text>
              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() => navigation.navigate('ServicesTab')}
              >
                <Text style={styles.detailsText}>{t('details')}</Text>
                <Ionicons
                  name={isRTL ? 'arrow-back' : 'arrow-forward'}
                  size={14}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* 5. آراء المرضى (Testimonials) */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>
          {t('patient_testimonials')}
        </Text>
        <Text style={[styles.sectionSub, { textAlign: 'center' }]}>
          {t('patient_stories')}
        </Text>

        {testimonials.map((testimonial, i) => (
          <View key={i} style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <View style={styles.avatarMini}>
                <Ionicons name="person" size={18} color={colors.primary} />
              </View>
              <View style={{ alignItems: 'flex-start' }}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Ionicons
                      key={s}
                      name="star"
                      size={10}
                      color={colors.primary}
                    />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.testimonialText}>"{t(testimonial.textKey)}"</Text>
          </View>
        ))}
      </View>

      {/* 6. CTA (ابدأ رحلتك) */}
      <View style={styles.cta}>
        <Text style={styles.ctaTitle}>{t('cta_title')}</Text>
        <Text style={styles.ctaSub}>{t('cta_desc')}</Text>
        <View style={styles.ctaBtns}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('AppointmentTab')}
          >
            <Text style={styles.ctaBtnText}>{t('book_now_btn')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaBtnSecondary}
            onPress={() => {
              /* اتصال */
            }}
          >
            <Ionicons name="call" size={20} color={colors.iconSecondary} />
            <Text style={styles.ctaBtnSecondaryText}>{t('call_us')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    
    </SmoothScrollView>
  );
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },

    header: {
      height: 65,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: spacing.sm,
    },
    logoCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    brand: { fontSize: 16 * fontScale, fontWeight: '900', color: colors.text },

    hero: {
      padding: spacing.lg,
      backgroundColor: colors.backgroundAlt,
      borderBottomLeftRadius: radius.lg,
      borderBottomRightRadius: radius.lg,
    },
    heroTitle: {
      fontSize: 32 * fontScale,
      fontWeight: '900',
      color: colors.text,
      lineHeight: 38,
    },
    heroSub: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      lineHeight: 21,
      marginTop: spacing.md,
    },

    heroBtns: {
      flexDirection: 'row-reverse',
      gap: spacing.sm,
      marginTop: spacing.lg,
    },
    btnPrimary: {
      backgroundColor: colors.buttonPrimary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
    },
    btnPrimaryText: { color: colors.buttonPrimaryText, fontWeight: '700', fontSize: 14 * fontScale },
    btnSecondary: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
    },
    btnSecondaryText: { color: colors.text, fontWeight: '700', fontSize: 14 * fontScale },

    ratingRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      marginTop: spacing.lg,
      gap: spacing.md,
    },
    avatarGroup: { flexDirection: 'row-reverse' },
    avatarMini: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.iconActive,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: -10,
    },
    ratingText: { color: colors.text, fontSize: 14 * fontScale, fontWeight: '700' },

    section: { padding: spacing.lg },
    sectionTitle: {
      fontSize: 24 * fontScale,
      fontWeight: '900',
      color: colors.text,
      marginBottom: spacing.xs,
    },
    sectionSub: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      marginBottom: spacing.lg,
      lineHeight: 22,
    },

    featureCard: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.card,
      padding: spacing.md,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
      ...shadow.card,
    },
    featureIcon: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      backgroundColor: colors.secondaryLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    featureTitle: {
      fontSize: 16 * fontScale,
      fontWeight: '900',
      color: colors.text,
    },
    featureDesc: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      marginTop: 4,
      lineHeight: 21,
    },

    servicesHeader: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    linkText: { color: colors.link, fontWeight: '700', fontSize: 14 * fontScale },
    detailsBtn: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      marginTop: spacing.sm,
      gap: 4,
    },
    detailsText: { color: colors.link, fontWeight: '700', fontSize: 14 * fontScale },

    serviceCard: {
      backgroundColor: colors.card,
      padding: spacing.lg,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    serviceIconBox: {
      width: 56,
      height: 56,
      borderRadius: radius.md,
      backgroundColor: colors.cardAlt,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
      alignSelf: 'flex-start',
    },
    serviceTitle: {
      fontSize: 16 * fontScale,
      fontWeight: '900',
      color: colors.text,
      marginBottom: spacing.xs,
    },
    serviceDesc: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      lineHeight: 22,
    },

    testimonialCard: {
      backgroundColor: colors.cardAlt,
      padding: spacing.lg,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    testimonialHeader: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.sm,
    },
    testimonialName: { fontSize: 16 * fontScale, fontWeight: '900', color: colors.text },
    testimonialText: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      lineHeight: 21,
      fontStyle: 'italic',
    },

    cta: {
      margin: spacing.lg,
      padding: spacing.xl,
      backgroundColor: colors.primary,
      borderRadius: radius.xl,
      borderWidth: 2,
      borderColor: colors.onPrimary + '40',
      alignItems: 'center',
    },
    ctaTitle: {
      fontSize: 22 * fontScale,
      fontWeight: '900',
      color: colors.onPrimary,
      textAlign: 'center',
      lineHeight: 29,
    },
    ctaSub: {
      fontSize: 14 * fontScale,
      color: colors.onPrimary,
      opacity: 0.8,
      textAlign: 'center',
      marginVertical: spacing.sm,
      lineHeight: 21,
    },
    ctaBtns: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.md,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    ctaBtn: {
      backgroundColor: colors.onPrimary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
    },
    ctaBtnText: { color: colors.primary, fontWeight: '900', fontSize: 16 * fontScale },
    ctaBtnSecondary: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.onPrimary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      gap: spacing.sm,
    },
    ctaBtnSecondaryText: { color: colors.onPrimary, fontWeight: '700', fontSize: 16 * fontScale },

    logoutBtn: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.error,
      margin: spacing.lg,
      padding: spacing.md,
      borderRadius: radius.md,
      gap: spacing.sm,
    },
    logoutText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 * fontScale },
  });
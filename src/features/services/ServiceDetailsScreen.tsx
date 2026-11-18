import { createDirectionalStyles } from '../../utils/direction';
import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ModeContext';
import { lightMode, spacing, radius, shadow } from '../../theme';
import ErrorState from '../../components/ErrorState';
import useServiceDetails from './useServiceDetails';
import { SPECIALTIES_STRING } from '../../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBar from '../../components/layout/NavBar';
import { SPECIALTY_TRANSLATION_KEYS } from '../../constants';

const { width } = Dimensions.get('window');

export default function ServiceDetailsScreen({ route, navigation }: any) {
    const insets= useSafeAreaInsets()
  const { serviceId } = route.params;
  const { colors,fontScale,t, isRTL} = useTheme();
  const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);

  const { service, loading } = useServiceDetails(serviceId);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!service) {
    return (
      <ErrorState
        message={t('service_not_found')}
        onRetry={() => navigation.goBack()}
      />
    );
  }

  const priceLabel = service.consulating
    ? `${t('service_consultation_price')} ${service.consulating}`
    : service.startFrom
    ? `${t('service_starting_from')} ${service.startFrom}`
    : `${t('service_exam_price')} ${service.price}`;

  const featuresCount = service.features?.length || 0;

  return (
    <View style={styles.root}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
<NavBar navigation={navigation} title={t('service_details')} />

        {/* 2. Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="medkit" size={48} color={colors.secondary} />
          </View>
          <Text style={styles.serviceName}>{service.name}</Text>
          <View style={styles.specialtyBadge}>
            <Text style={styles.specialtyText}>
              {t(SPECIALTY_TRANSLATION_KEYS[service.specialization] || 'specialty')}
            </Text>
          </View>
        </View>

        {/* 3. السعر */}
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <View style={styles.priceIconWrapper}>
              <Ionicons name="cash-outline" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.priceLabel}>{t('price')}</Text>
              <Text style={styles.priceValue}>
                {priceLabel} <Text style={styles.currency}>{t('currency')}</Text>
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          </View>
        </View>

        {/* 4. الوصف */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t('about_service')}</Text>
          </View>
          <Text style={styles.description}>
            {service.description || t('service_description_unavailable')}
          </Text>
        </View>

        {/* 5. المميزات (Features) */}
        {featuresCount > 0 && (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star-outline" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>{t('service_features')}</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{featuresCount}</Text>
              </View>
            </View>
            {service.features.map((feature: any, index: number) => (
              <View key={index} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name="checkmark" size={14} color={colors.onPrimary} />
                </View>
                <Text style={styles.featureText}>{feature.feature}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 6. معلومات إضافية / الضمانات */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t('additional_info')}</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={24} color={colors.secondary} />
              <Text style={styles.infoValue}>{t('service_duration')}</Text>
              <Text style={styles.infoLabel}>{t('depends_on_service')}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark-outline" size={24} color={colors.secondary} />
              <Text style={styles.infoValue}>{t('warranty')}</Text>
              <Text style={styles.infoLabel}>{t('certified_quality')}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={24} color={colors.secondary} />
              <Text style={styles.infoValue}>{t('team')}</Text>
              <Text style={styles.infoLabel}>{t('expert_team')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 7. زرار الحجز (Sticky) */}
      <View style={[styles.footer,{paddingBottom:insets.bottom}]}>
        <View>
          <Text style={styles.footerPriceLabel}>{t('price')}</Text>
          <Text style={styles.footerPrice}>{priceLabel} {t('currency')}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() =>
            navigation.navigate('Main',
                 {
                    screen:"AppointmentTab",
                    params:{
                        serviceId: service.id,
                        specialty: service.specialization,
                    }
            })
          }
        >
          <Text style={styles.bookBtnText}>{t('book_this_service')}</Text>
          <Ionicons name="calendar" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },

    // الهيدر
    header: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: { padding: spacing.xs },
    headerTitle: {
      fontSize: 18 * fontScale,
      fontWeight: '900',
      color: colors.text,
    },

    // Hero
    hero: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      borderBottomLeftRadius: radius.xl,
      borderBottomRightRadius: radius.xl,
    },
    heroIcon: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
      borderWidth: 3,
      borderColor: colors.secondary,
    },
    serviceName: {
      fontSize: 24 * fontScale,
      fontWeight: '900',
      color: colors.onPrimary,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    specialtyBadge: {
      backgroundColor: colors.secondary,
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      borderRadius: radius.pill,
    },
    specialtyText: {
      fontSize: 13 * fontScale,
      fontWeight: '900',
      color: colors.onSecondary,
    },

    // السعر
    priceCard: {
      backgroundColor: colors.card,
      margin: spacing.md,
      borderRadius: radius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow.card,
    },
    priceRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: spacing.md,
    },
    priceIconWrapper: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    priceLabel: {
      fontSize: 13 * fontScale,
      color: colors.textMuted,
      fontWeight: '700',
       
      marginBottom: 4,
    },
    priceValue: {
      fontSize: 22 * fontScale,
      fontWeight: '900',
      color: colors.text,
       
    },
    currency: {
      fontSize: 14 * fontScale,
      color: colors.secondary,
      fontWeight: '700',
    },

    // الكروت
    card: {
      backgroundColor: colors.card,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      borderRadius: radius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionHeader: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
      paddingBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    sectionTitle: {
      fontSize: 16 * fontScale,
      fontWeight: '900',
      color: colors.text,
      flex: 1,
       
    },
    countBadge: {
      backgroundColor: colors.primaryLight,
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },
    countBadgeText: {
      color: colors.primary,
      fontWeight: '900',
      fontSize: 13 * fontScale,
    },

    // الوصف
    description: {
      fontSize: 15 * fontScale,
      color: colors.textSecondary,
      lineHeight: 24,
       
    },

    // المميزات
    featureRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    featureIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.success,
      justifyContent: 'center',
      alignItems: 'center',
    },
    featureText: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
       
      flex: 1,
      lineHeight: 22,
    },

    // المعلومات الإضافية
    infoGrid: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    infoItem: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.backgroundAlt,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.md,
    },
    infoValue: {
      fontSize: 13 * fontScale,
      fontWeight: '900',
      color: colors.text,
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    infoLabel: {
      fontSize: 11 * fontScale,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: 2,
    },

    // الفوتر (Sticky Book Button)
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      padding: spacing.md,
      paddingTop:spacing.sm,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      ...shadow.card,
    },
    footerPriceLabel: {
      fontSize: 11 * fontScale,
      color: colors.textMuted,
       
    },
    footerPrice: {
      fontSize: 18 * fontScale,
      fontWeight: '900',
      color: colors.text,
       
    },
    bookBtn: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      marginRight:50,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xs,
      borderRadius: radius.md,
      gap: spacing.sm,
      flex: 1,
      marginLeft: spacing.md,
    },
    bookBtnText: {
      color: colors.onPrimary,
      fontWeight: '900',
      fontSize: 15 * fontScale,
    },
  });
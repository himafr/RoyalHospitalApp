import { createDirectionalStyles } from '../../utils/direction';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ModeContext';
import PrimaryButton from '../../components/PrimaryButton';
import { lightMode, radius, shadow, spacing } from '../../theme';
import { SPECIALTY_TRANSLATION_KEYS } from '../../constants';

interface ServiceCardProps {
  service: any;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const navigation = useNavigation<any>();
  const { colors,fontScale,t, isRTL} = useTheme();
  const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);

  // تجهيز السعر
  const priceLabel = service.consulating
    ? `${t('service_consultation_price')} ${service.consulating}`
    : service.startFrom
    ? `${t('service_starting_from')} ${service.startFrom}`
    : `${t('service_exam_price')} ${service.price}`;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate('ServiceDetails', { serviceId: service.id })
      }
    >
      <View style={styles.alertBadge}>
        <Ionicons name="alert-circle" size={16} color={colors.info} />
      </View>
      {/* 1. الأيقونة والعنوان */}
      <View style={styles.header}>
        <View style={styles.iconHolder}>
          <Ionicons name="medkit-outline" size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <Text style={styles.name}>{service.name}</Text>
          {service.specialization && (
            <Text style={styles.specialty}>
              {t(SPECIALTY_TRANSLATION_KEYS[service.specialization] || 'specialty')}
            </Text>
          )}
        </View>
      </View>

      {/* 2. الوصف */}
      <Text style={styles.desc} numberOfLines={2}>
        {service.description}
      </Text>

      {/* 3. المميزات (لو موجودة) */}
      {service.features && service.features.length > 0 && (
        <View style={styles.featuresRow}>
          <Ionicons name="checkmark-circle" size={14} color={colors.success} />
          <Text style={styles.featureText}>
            {service.features[0].feature}
            {service.features.length > 1 && ` +${service.features.length - 1}`}
          </Text>
        </View>
      )}

      {/* 4. السعر + زرار الحجز */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>{t('price')}</Text>
          <Text style={styles.price}>
            {priceLabel} <Text style={styles.currency}>{t('currency')}</Text>
          </Text>
        </View>
        <PrimaryButton
          title={t('book_now_service')}
          variant="primary"
          style={styles.bookBtn}
          onPress={() =>
            navigation.navigate('AppointmentTab', {
              serviceId: service.id,
              specialty: service.specialization,
            })
          }
        />
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    alertBadge: {
      position: 'absolute',
      top: spacing.sm,
      left: spacing.sm,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.backgroundAlt,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.info,
      zIndex: 10,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow.card,
    },

    header: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    iconHolder: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    name: {
      fontSize: 18 * fontScale,
      fontWeight: '900',
      color: colors.text,
      textAlign: 'right',
      marginBottom: 2,
    },
    specialty: {
      marginTop: 5,
      fontSize: 12 * fontScale,
      color: colors.secondary,
      fontWeight: '700',
      textAlign: 'right',
    },

    desc: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      lineHeight: 22,
      textAlign: 'right',
      marginBottom: spacing.md,
    },

    featuresRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.md,
    },
    featureText: {
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      fontWeight: '700',
      textAlign: 'right',
    },

    footer: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      paddingTop: spacing.md,
    },
    priceLabel: {
      fontSize: 11 * fontScale,
      color: colors.textMuted,
      textAlign: 'right',
      marginBottom: 2,
    },
    price: {
      fontSize: 18 * fontScale,
      fontWeight: '900',
      color: colors.text,
      textAlign: 'right',
    },
    currency: {
      fontSize: 13 * fontScale,
      color: colors.secondary,
      fontWeight: '700',
    },
    bookBtn: {
      width: 130,
      height: 42,
    },
  });

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ModeContext';
import { lightMode, spacing, radius } from '../../theme';
import ErrorState from '../../components/ErrorState';
import useServiceDetails from './useServiceDetails';

export default function ServiceDetailsScreen({ route, navigation }: any) {
  const { serviceId } = route.params;
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

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
        message="لم نتمكن من العثور على هذه الخدمة."
        onRetry={() => navigation.goBack()}
      />
    );
  }

  const priceLabel = service.consulating
    ? `استشارة ${service.consulating}`
    : service.startFrom
    ? `تبدأ من ${service.startFrom}`
    : `سعر الكشف ${service.price}`;

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-forward" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تفاصيل الخدمة</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 2. كارت الخدمة */}
      <View style={styles.card}>
        <View style={styles.iconBox}>
          <Ionicons name="medkit-outline" size={32} color={colors.primary} />
        </View>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.specialty}>{service.specialization}</Text>
        <Text style={styles.description}>{service.description}</Text>
      </View>

      {/* 3. السعر */}
      <View style={styles.priceCard}>
        <View style={styles.priceRow}>
          <Ionicons name="cash-outline" size={24} color={colors.secondary} />
          <Text style={styles.priceLabel}>السعر</Text>
        </View>
        <Text style={styles.priceValue}>
          {priceLabel} <Text style={styles.currency}>ر.س</Text>
        </Text>
      </View>

      {/* 4. المميزات (Features) */}
      {service.features && service.features.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>مميزات الخدمة</Text>
          {service.features.map((feature: any, index: number) => (
            <View key={index} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.featureText}>{feature.feature}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 5. زرار الحجز */}
      <TouchableOpacity
        style={styles.bookBtn}
        onPress={() =>
          navigation.navigate('AppointmentTab', {
            serviceId: service.id,
            specialty: service.specialization,
          })
        }
      >
        <Text style={styles.bookBtnText}>احجز هذه الخدمة</Text>
        <Ionicons name="calendar" size={20} color={colors.onPrimary} />
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const getStyles = (colors: typeof lightMode) =>
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
      fontSize: 18,
      fontWeight: '900',
      color: colors.text,
    },

    // كارت الخدمة
    card: {
      backgroundColor: colors.card,
      margin: spacing.md,
      borderRadius: radius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    iconBox: {
      width: 64,
      height: 64,
      borderRadius: radius.lg,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    serviceName: {
      fontSize: 22,
      fontWeight: '900',
      color: colors.text,
      textAlign: 'right',
      marginBottom: spacing.xs,
    },
    specialty: {
      fontSize: 13,
      color: colors.secondary,
      fontWeight: '700',
      textAlign: 'right',
      marginBottom: spacing.md,
    },
    description: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 24,
      textAlign: 'right',
    },

    // السعر
    priceCard: {
      backgroundColor: colors.primary,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      borderRadius: radius.lg,
      padding: spacing.lg,
    },
    priceRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    priceLabel: {
      fontSize: 14,
      color: colors.secondaryLight,
      fontWeight: '700',
    },
    priceValue: {
      fontSize: 24,
      fontWeight: '900',
      color: colors.onPrimary,
      textAlign: 'right',
    },
    currency: {
      fontSize: 14,
      color: colors.secondaryLight,
      fontWeight: '700',
    },

    // المميزات
    sectionTitle: {
      fontSize: 16,
      fontWeight: '900',
      color: colors.text,
      textAlign: 'right',
      marginBottom: spacing.md,
    },
    featureRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    featureText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'right',
      flex: 1,
    },

    // زرار الحجز
    bookBtn: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      marginHorizontal: spacing.md,
      padding: spacing.md,
      borderRadius: radius.md,
      gap: spacing.sm,
    },
    bookBtnText: {
      color: colors.onPrimary,
      fontWeight: '900',
      fontSize: 16,
    },
  });
import { createDirectionalStyles } from '../../utils/direction';
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ModeContext';
import { lightMode, spacing, radius, shadow } from '../../theme';
import { formatLocalizedDate } from '../../utils/language';

// ==================== MOCK DATA ====================
const MOCK_USER = {
  name: 'أحمد المحمدي',
  joinDate: '2023-01-15',
  totalPayments: 1250,
  lastLoginKey: 'two_hours_ago',
  roleKey: 'gold_patient',
  insuranceNumber: '12345678',
  insuranceExpiry: '2026-12-31',
  bloodType: 'O+',
  loyaltyPoints: 320,
  nextAppointment: {
    doctor: 'د. محمد العلي',
    specialtyKey: 'specialty_cardiology',
    date: '2026-11-15',
    time: '10:00',
  },
} as const;

const MOCK_RECENT_APPOINTMENTS = [
  { id: 1, doctor: 'د. محمد العلي', specialtyKey: 'specialty_cardiology', date: '2026-11-10', status: 'completed' },
  { id: 2, doctor: 'د. سارة المنصور', specialtyKey: 'specialty_dermatology', date: '2026-11-05', status: 'cancelled' },
  { id: 3, doctor: 'د. فهد الراشد', specialtyKey: 'specialty_pediatrics', date: '2026-10-28', status: 'completed' },
  { id: 4, doctor: 'د. محمد العلي', specialtyKey: 'specialty_cardiology', date: '2026-10-15', status: 'completed' },
  { id: 5, doctor: 'د. سارة المنصور', specialtyKey: 'specialty_dermatology', date: '2026-10-01', status: 'completed' },
] as const;

const MOCK_ACTIVITIES = [
  { id: 1, type: 'login', textKey: 'activity_login_success', timeKey: 'two_hours_ago', icon: 'log-in-outline', color: 'info' },
  { id: 2, type: 'booking', textKey: 'activity_booking_confirmed', timeKey: 'yesterday', icon: 'checkmark-circle-outline', color: 'success' },
  { id: 3, type: 'payment', textKey: 'activity_payment_made', timeKey: 'three_days_ago', icon: 'cash-outline', color: 'warning' },
  { id: 4, type: 'failure', textKey: 'activity_payment_failed', timeKey: 'five_days_ago', icon: 'close-circle-outline', color: 'error' },
  { id: 5, type: 'update', textKey: 'activity_phone_updated', timeKey: 'one_week_ago', icon: 'create-outline', color: 'primary' },
  { id: 6, type: 'login', textKey: 'activity_new_device_login', timeKey: 'two_weeks_ago', icon: 'phone-portrait-outline', color: 'info' },
] as const;

const MOCK_STATS = [
  { id: 1, labelKey: 'total_visits', value: '24', icon: 'calendar-outline', color: 'primary' },
  { id: 2, labelKey: 'total_payments', value: '1,250', icon: 'wallet-outline', color: 'warning', currency: true },
  { id: 3, labelKey: 'cancelled_appointments', value: '2', icon: 'close-circle-outline', color: 'error' },
] as const;

const MOCK_MEDICATIONS = [
  { id: 1, name: 'Amoxicillin 500mg', durationKey: 'days_7', status: 'active' },
  { id: 2, name: 'Paracetamol 500mg', durationKey: 'days_3', status: 'active' },
  { id: 3, name: 'Vitamin D 50000IU', durationKey: 'monthly', status: 'active' },
] as const;

const MOCK_LAB_RESULTS = [
  { id: 1, nameKey: 'complete_blood_count', date: '2026-11-10', size: '1.2 MB' },
  { id: 2, nameKey: 'liver_function_tests', date: '2026-11-05', size: '850 KB' },
] as const;

const MOCK_FAVORITE_DOCTORS = [
  { id: 1, name: 'د. محمد العلي', specialtyKey: 'specialty_cardiology', rating: 4.9 },
  { id: 2, name: 'د. سارة المنصور', specialtyKey: 'specialty_dermatology', rating: 4.8 },
] as const;

const MOCK_PAYMENTS = [
  { id: 1, nameKey: 'service_consultation', amount: 450, date: '2026-11-10', status: 'paid' },
  { id: 2, nameKey: 'lab_test', amount: 300, date: '2026-11-05', status: 'paid' },
  { id: 3, nameKey: 'service_consultation', amount: 500, date: '2026-10-28', status: 'pending' },
] as const;

// ==================== COMPONENT ====================
export default function PatientDashboardScreen({ navigation }: any) {
  const { colors, fontScale, language, t, isRTL} = useTheme();
  const styles = useMemo(() => createDirectionalStyles(getStyles(colors, n => n * fontScale), isRTL), [colors, fontScale, isRTL]);

  const getColor = (colorName: string) => {
    const map: Record<string, string> = {
      primary: colors.primary,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      info: colors.info,
    };
    return map[colorName] || colors.textSecondary;
  };

  const getStatusText = (status: string) =>
    status === 'completed' ? t('status_completed') : status === 'cancelled' ? t('status_cancelled') : t('status_pending');

  const getStatusColor = (status: string) =>
    status === 'completed' ? colors.success : status === 'cancelled' ? colors.error : colors.warning;

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      
      
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{MOCK_USER.name.charAt(0)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{MOCK_USER.name}</Text>
          <Text style={styles.userRole}>{t(MOCK_USER.roleKey)}</Text>
          <View style={styles.joinRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
            <Text style={styles.joinText}>{t('join_date_prefix')} {formatLocalizedDate(MOCK_USER.joinDate, language)}</Text>
          </View>
        </View>
        <View style={styles.lastLoginBadge}>
          <Ionicons name="time-outline" size={12} color={colors.success} />
          <Text style={styles.lastLoginText}>{t(MOCK_USER.lastLoginKey)}</Text>
        </View>
      </View>

      {/* 3. معلومات سريعة (التأمين، فصيلة الدم، نقاط الولاء) */}
      <View style={styles.quickInfoRow}>
        <View style={styles.quickInfoCard}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.success} />
          <Text style={styles.quickInfoLabel}>{t('insurance')}</Text>
          <Text style={styles.quickInfoValue} numberOfLines={1}>{t('health_insurance')} - {MOCK_USER.insuranceNumber}</Text>
          <Text style={styles.quickInfoSub}>{t('insurance_expiry')} {formatLocalizedDate(MOCK_USER.insuranceExpiry, language)}</Text>
        </View>
        <View style={styles.quickInfoCard}>
          <Ionicons name="water-outline" size={20} color={colors.error} />
          <Text style={styles.quickInfoLabel}>{t('blood_type')}</Text>
          <Text style={styles.quickInfoValue}>{MOCK_USER.bloodType}</Text>
          <Text style={styles.quickInfoSub}>{t('last_checkup')}</Text>
        </View>
        <View style={styles.quickInfoCard}>
          <Ionicons name="star-outline" size={20} color={colors.warning} />
          <Text style={styles.quickInfoLabel}>{t('loyalty_points')}</Text>
          <Text style={styles.quickInfoValue}>{MOCK_USER.loyaltyPoints}</Text>
          <Text style={styles.quickInfoSub}>{t('point')}</Text>
        </View>
      </View>

      {/* 4. الموعد القادم */}
      <View style={styles.nextAppointmentCard}>
        <View style={styles.nextAppointmentHeader}>
          <Ionicons name="calendar" size={20} color={colors.primary} />
          <Text style={styles.nextAppointmentTitle}>{t('your_next_appointment')}</Text>
        </View>
        <View style={styles.nextAppointmentBody}>
          <Text style={styles.nextAppointmentDoctor}>{MOCK_USER.nextAppointment.doctor}</Text>
          <Text style={styles.nextAppointmentSpecialty}>{t(MOCK_USER.nextAppointment.specialtyKey)}</Text>
          <View style={styles.nextAppointmentTimeRow}>
            <Ionicons name="time-outline" size={14} color={colors.secondary} />
            <Text style={styles.nextAppointmentTime}>
              {formatLocalizedDate(MOCK_USER.nextAppointment.date, language)} - {MOCK_USER.nextAppointment.time} {t('am')}
            </Text>
          </View>
          <TouchableOpacity style={styles.nextAppointmentBtn}>
            <Text style={styles.nextAppointmentBtnText}>{t('view_all')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. الإحصائيات */}
      <View style={styles.statsGrid}>
        {MOCK_STATS.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: getColor(stat.color) + '20' }]}>
              <Ionicons name={stat.icon as any} size={20} color={getColor(stat.color)} />
            </View>
            <Text style={styles.statValue}>
              {stat.value} {'currency' in stat && stat.currency && <Text style={styles.statCurrency}>{t('currency')}</Text>}
            </Text>
            <Text style={styles.statLabel}>{t(stat.labelKey)}</Text>
          </View>
        ))}
      </View>

      {/* 6. الأدوية الحالية */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('current_medications')}</Text>
        </View>
        {MOCK_MEDICATIONS.map((med, index) => (
          <View
            key={med.id}
            style={[styles.listItem, index === MOCK_MEDICATIONS.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={[styles.listItemIcon, { backgroundColor: colors.warning + '20' }]}>
              <Ionicons name="medkit-outline" size={18} color={colors.warning} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listItemTitle}>{med.name}</Text>
              <Text style={styles.listItemSubtitle}>{t(med.durationKey)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
              <Text style={[styles.statusText, { color: colors.success }]}>{t('medication_active')}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 7. نتائج التحاليل */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('lab_results')}</Text>
        </View>
        {MOCK_LAB_RESULTS.map((lab, index) => (
          <View
            key={lab.id}
            style={[styles.listItem, index === MOCK_LAB_RESULTS.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={[styles.listItemIcon, { backgroundColor: colors.info + '20' }]}>
              <Ionicons name="flask-outline" size={18} color={colors.info} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listItemTitle}>{t(lab.nameKey)}</Text>
              <Text style={styles.listItemSubtitle}>{formatLocalizedDate(lab.date, language)} - {lab.size}</Text>
            </View>
            <TouchableOpacity style={styles.downloadBtn}>
              <Ionicons name="download-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 8. الأطباء المفضلين */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('favorite_doctors')}</Text>
        </View>
        {MOCK_FAVORITE_DOCTORS.map((doc, index) => (
          <View
            key={doc.id}
            style={[styles.listItem, index === MOCK_FAVORITE_DOCTORS.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={[styles.listItemIcon, { backgroundColor: colors.primaryLight }]}>
              <Text style={styles.listItemIconText}>{doc.name.charAt(3)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listItemTitle}>{doc.name}</Text>
              <Text style={styles.listItemSubtitle}>{t(doc.specialtyKey)}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={colors.warning} />
              <Text style={styles.ratingText}>{doc.rating}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 9. المدفوعات */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('payment_history')}</Text>
        </View>
        {MOCK_PAYMENTS.map((payment, index) => (
          <View
            key={payment.id}
            style={[styles.listItem, index === MOCK_PAYMENTS.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={[styles.listItemIcon, { backgroundColor: colors.success + '20' }]}>
              <Ionicons name="cash-outline" size={18} color={colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listItemTitle}>{t(payment.nameKey)}</Text>
              <Text style={styles.listItemSubtitle}>{formatLocalizedDate(payment.date, language)}</Text>
            </View>
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={styles.paymentAmount}>{payment.amount} {t('currency')}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
                  {payment.status === 'paid' ? t('paid') : getStatusText(payment.status)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 10. آخر 5 مواعيد */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('recent_appointments')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllAppointments')}>
            <Text style={styles.linkText}>{t('view_all')}</Text>
          </TouchableOpacity>
        </View>
        {MOCK_RECENT_APPOINTMENTS.map((apt, index) => (
          <View
            key={apt.id}
            style={[styles.listItem, index === MOCK_RECENT_APPOINTMENTS.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={[styles.listItemIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="medkit-outline" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listItemTitle}>{apt.doctor}</Text>
              <Text style={styles.listItemSubtitle}>{t(apt.specialtyKey)} - {formatLocalizedDate(apt.date, language)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(apt.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(apt.status) }]}>
                {getStatusText(apt.status)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* 11. سجل النشاطات */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('activity_log')}</Text>
        </View>
        {MOCK_ACTIVITIES.map((activity, index) => (
          <View
            key={activity.id}
            style={[styles.activityRow, index === MOCK_ACTIVITIES.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={[styles.activityIconBox, { backgroundColor: getColor(activity.color) + '20' }]}>
              <Ionicons name={activity.icon as any} size={18} color={getColor(activity.color)} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityText}>{t(activity.textKey)}</Text>
              <Text style={styles.activityTime}>{t(activity.timeKey)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// ==================== STYLES ====================
const getStyles = (colors: typeof lightMode, fs: (n: number) => number) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },

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
    headerTitle: { fontSize: fs(18), fontWeight: '900', color: colors.text },

    // كارت المستخدم
    profileCard: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: colors.card,
      marginVertical: spacing.md,
      borderRadius: radius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow.card,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: spacing.md,
    },
    avatarText: { fontSize: fs(28), fontWeight: '900', color: colors.primary },
    userName: { fontSize: fs(18), fontWeight: '900', color: colors.text, textAlign: 'right' },
    userRole: { fontSize: fs(13), color: colors.textSecondary, textAlign: 'right', marginTop: 2 },
    joinRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginTop: spacing.xs },
    joinText: { fontSize: fs(12), color: colors.textMuted },
    lastLoginBadge: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.success + '15',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.pill,
    },
    lastLoginText: { fontSize: fs(11), color: colors.success, fontWeight: '700' },

    // معلومات سريعة
    quickInfoRow: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    quickInfoCard: {
      flex: 1,
      backgroundColor: colors.card,
      padding: spacing.sm,
      borderRadius: radius.md,
      marginHorizontal: 4,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickInfoLabel: { fontSize: fs(11), color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
    quickInfoValue: { fontSize: fs(13), color: colors.text, fontWeight: '900', marginTop: 2, textAlign: 'center' },
    quickInfoSub: { fontSize: fs(10), color: colors.textMuted, textAlign: 'center', marginTop: 2 },

    // الموعد القادم
    nextAppointmentCard: {
      backgroundColor: colors.card,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      borderRadius: radius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.primaryLight,
      ...shadow.card,
    },
    nextAppointmentHeader: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    nextAppointmentTitle: { fontSize: fs(14), fontWeight: '900', color: colors.primary },
    nextAppointmentBody: { paddingRight: spacing.sm },
    nextAppointmentDoctor: { fontSize: fs(16), fontWeight: '900', color: colors.text, textAlign: 'right' },
    nextAppointmentSpecialty: { fontSize: fs(12), color: colors.textSecondary, textAlign: 'right', marginTop: 2 },
    nextAppointmentTimeRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginTop: spacing.xs },
    nextAppointmentTime: { fontSize: fs(12), color: colors.secondary, fontWeight: '700' },
    nextAppointmentBtn: {
      marginTop: spacing.sm,
      backgroundColor: colors.primary,
      paddingVertical: spacing.xs,
      borderRadius: radius.sm,
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.md,
    },
    nextAppointmentBtnText: { fontSize: fs(12), color: colors.onPrimary, fontWeight: '700' },

    // الإحصائيات
    statsGrid: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      padding: spacing.md,
      alignItems: 'center',
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow.card,
    },
    statIconBox: {
      width: 40, height: 40, borderRadius: radius.md,
      justifyContent: 'center', alignItems: 'center',
      marginBottom: spacing.sm,
    },
    statValue: { fontSize: fs(20), fontWeight: '900', color: colors.text },
    statCurrency: { fontSize: fs(11), color: colors.textMuted },
    statLabel: { fontSize: fs(11), color: colors.textMuted, marginTop: 2, textAlign: 'center' },

    // الأقسام
    section: {
      backgroundColor: colors.card,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      borderRadius: radius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow.card,
    },
    sectionHeader: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
      paddingBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    sectionTitle: { fontSize: fs(16), fontWeight: '900', color: colors.text },
    linkText: { fontSize: fs(13), color: colors.secondary, fontWeight: '700' },

    // قائمة
    listItem: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
      gap: spacing.md,
    },
    listItemIcon: {
      width: 40, height: 40, borderRadius: radius.md,
      justifyContent: 'center', alignItems: 'center',
    },
    listItemIconText: { fontSize: fs(16), fontWeight: '900', color: colors.primary },
    listItemTitle: { fontSize: fs(14), fontWeight: '700', color: colors.text, textAlign: 'right' },
    listItemSubtitle: { fontSize: fs(12), color: colors.textMuted, textAlign: 'right', marginTop: 2 },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.pill,
    },
    statusText: { fontSize: fs(11), fontWeight: '900' },
    downloadBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center', alignItems: 'center',
    },
    ratingBadge: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 2,
      backgroundColor: colors.warning + '15',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.pill,
    },
    ratingText: { fontSize: fs(12), color: colors.warning, fontWeight: '900' },
    paymentAmount: { fontSize: fs(14), fontWeight: '900', color: colors.text, textAlign: 'right' },

    // النشاطات
    activityRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
      gap: spacing.md,
    },
    activityIconBox: {
      width: 40, height: 40, borderRadius: 20,
      justifyContent: 'center', alignItems: 'center',
    },
    activityText: { fontSize: fs(14), color: colors.text, textAlign: 'right' },
    activityTime: { fontSize: fs(11), color: colors.textMuted, textAlign: 'right', marginTop: 2 },
  });
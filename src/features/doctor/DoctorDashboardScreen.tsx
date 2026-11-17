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
const MOCK_DOCTOR = {
  name: 'محمد العلي',
  specialty: 'القلب والأوعية الدموية',
  joinDate: '2023-01-15',
  lastLoginKey: 'one_hour_ago',
  patientsCount: 1250,
  rating: 4.9,
  experienceYears: 15,
  certificationsCount: 8,
  newPatientsThisMonth: 24,
  mostProfitableSpecialty: 'القلب والأوعية الدموية',
  prescriptionsWritten: 342,
  contactEmail: 'm@ali.com',
  contactPhone: '01146839894',
} as const;

const MOCK_STATS = [
  { id: 1, labelKey: 'total_patients', value: '1,250', icon: 'people-outline', color: 'primary' },
  { id: 2, labelKey: 'total_earnings', value: '85,400', icon: 'cash-outline', color: 'warning', currency: true },
  { id: 3, labelKey: 'completed_appointments_count', value: '342', icon: 'checkmark-circle-outline', color: 'success' },
  { id: 4, labelKey: 'overall_rating', value: '4.9', icon: 'star-outline', color: 'info', suffix: '/5' },
] as const;

const MOCK_RECENT_APPOINTMENTS = [
  { id: 1, patient: 'سارة الأحمد', date: '2026-11-10', time: '10:00', status: 'completed' },
  { id: 2, patient: 'خالد الفيصل', date: '2026-11-09', time: '12:30', status: 'completed' },
  { id: 3, patient: 'نورة العتيبي', date: '2026-11-08', time: '14:00', status: 'cancelled' },
  { id: 4, patient: 'فهد الراشد', date: '2026-11-07', time: '16:30', status: 'completed' },
  { id: 5, patient: 'لمى سعد', date: '2026-11-06', time: '09:30', status: 'completed' },
] as const;

const MOCK_ACTIVITIES = [
  { id: 1, type: 'login', textKey: 'activity_login_success', timeKey: 'one_hour_ago', icon: 'log-in-outline', color: 'info' },
  { id: 2, type: 'appointment', textKey: 'activity_booking_confirmed', timeKey: 'two_hours_ago', icon: 'checkmark-circle-outline', color: 'success' },
  { id: 3, type: 'payment', textKey: 'activity_payment_received', timeKey: 'yesterday', icon: 'cash-outline', color: 'warning' },
  { id: 4, type: 'update', textKey: 'activity_profile_updated', timeKey: 'three_days_ago', icon: 'create-outline', color: 'primary' },
  { id: 5, type: 'failure', textKey: 'activity_report_failed', timeKey: 'five_days_ago', icon: 'close-circle-outline', color: 'error' },
  { id: 6, type: 'login', textKey: 'activity_new_device_login', timeKey: 'one_week_ago', icon: 'phone-portrait-outline', color: 'info' },
] as const;

const MOCK_PERFORMANCE = [
  { id: 1, labelKey: 'attendance_rate', value: 92, color: 'success' },
  { id: 2, labelKey: 'completion_rate', value: 88, color: 'primary' },
  { id: 3, labelKey: 'patient_satisfaction', value: 96, color: 'warning' },
] as const;

const MOCK_MONTHLY_EARNINGS = [
  { month: 'jan', value: 4500 },
  { month: 'feb', value: 6200 },
  { month: 'mar', value: 5400 },
  { month: 'apr', value: 7800 },
  { month: 'may', value: 6100 },
  { month: 'jun', value: 8400, isCurrent: true },
] as const;

const MOCK_NEW_PATIENTS = [
  { id: 1, name: 'سارة الأحمد', date: '2026-11-10' },
  { id: 2, name: 'نورة العتيبي', date: '2026-11-08' },
  { id: 3, name: 'لمى سعد', date: '2026-11-06' },
] as const;

const MOCK_CERTIFICATIONS = [
  { id: 1, nameKey: 'cert_saudiboard_cardiology', status: 'verified' },
  { id: 2, nameKey: 'cert_american_fellowship_cardiology', status: 'verified' },
  { id: 3, nameKey: 'cert_acls', status: 'pending' },
] as const;

// ==================== COMPONENT ====================
export default function DoctorDashboardScreen({ navigation }: any) {
  const { colors, fontScale, language, t, isRTL} = useTheme();
  const styles = useMemo(() => createDirectionalStyles(getStyles(colors, n => n * fontScale), isRTL), [colors, fontScale, isRTL]);

  const maxEarning = Math.max(...MOCK_MONTHLY_EARNINGS.map((e) => e.value));

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
          <Text style={styles.avatarText}>{MOCK_DOCTOR.name.charAt(0)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{t('doctor_prefix')} {MOCK_DOCTOR.name}</Text>
          <Text style={styles.userRole}>{t('specialty_cardiology')}</Text>
          <View style={styles.joinRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
            <Text style={styles.joinText}>{t('join_date_prefix')} {formatLocalizedDate(MOCK_DOCTOR.joinDate, language)}</Text>
          </View>
        </View>
        <View style={styles.lastLoginBadge}>
          <Ionicons name="time-outline" size={12} color={colors.success} />
          <Text style={styles.lastLoginText}>{t(MOCK_DOCTOR.lastLoginKey)}</Text>
        </View>
      </View>

      {/* 3. معلومات سريعة */}
      <View style={styles.quickInfoRow}>
        <View style={styles.quickInfoCard}>
          <Ionicons name="school-outline" size={20} color={colors.primary} />
          <Text style={styles.quickInfoLabel}>{t('quick_certifications')}</Text>
          <Text style={styles.quickInfoValue}>{MOCK_DOCTOR.certificationsCount}</Text>
          <Text style={styles.quickInfoSub}>{t('certified')}</Text>
        </View>
        <View style={styles.quickInfoCard}>
          <Ionicons name="person-add-outline" size={20} color={colors.success} />
          <Text style={styles.quickInfoLabel}>{t('new_patients')}</Text>
          <Text style={styles.quickInfoValue}>{MOCK_DOCTOR.newPatientsThisMonth}</Text>
          <Text style={styles.quickInfoSub}>{t('this_month')}</Text>
        </View>
        <View style={styles.quickInfoCard}>
          <Ionicons name="document-text-outline" size={20} color={colors.warning} />
          <Text style={styles.quickInfoLabel}>{t('prescriptions')}</Text>
          <Text style={styles.quickInfoValue}>{MOCK_DOCTOR.prescriptionsWritten}</Text>
          <Text style={styles.quickInfoSub}>{t('written')}</Text>
        </View>
      </View>

      {/* 4. الإحصائيات */}
      <View style={styles.statsGrid}>
        {MOCK_STATS.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: getColor(stat.color) + '20' }]}>
              <Ionicons name={stat.icon as any} size={20} color={getColor(stat.color)} />
            </View>
            <Text style={styles.statValue}>
              {stat.value}
              {'currency' in stat && stat.currency && <Text style={styles.statCurrency}> {t('currency')}</Text>}
              {'suffix' in stat && stat.suffix && <Text style={styles.statCurrency}>{stat.suffix}</Text>}
            </Text>
            <Text style={styles.statLabel}>{t(stat.labelKey)}</Text>
          </View>
        ))}
      </View>

      {/* 5. إحصائيات الأداء */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('performance_stats')}</Text>
        </View>
        {MOCK_PERFORMANCE.map((perf) => (
          <View key={perf.id} style={styles.performanceRow}>
            <View style={styles.performanceHeader}>
              <Text style={styles.performanceLabel}>{t(perf.labelKey)}</Text>
              <Text style={[styles.performanceValue, { color: getColor(perf.color) }]}>{perf.value}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${perf.value}%`, backgroundColor: getColor(perf.color) }]} />
            </View>
          </View>
        ))}
      </View>

      {/* 6. الرسم البياني (الأرباح الشهرية) */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('monthly_revenue')}</Text>
          <View style={styles.chartFilter}>
            <Text style={styles.chartFilterText}>{t('last_six_months')}</Text>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.chartGridLines}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.gridLine} />
            ))}
          </View>
          <View style={styles.barsContainer}>
            {MOCK_MONTHLY_EARNINGS.map((item, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${(item.value / maxEarning) * 100}%`,
                        backgroundColor: 'isCurrent' in item && item.isCurrent ? colors.secondary : colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, 'isCurrent' in item && item.isCurrent && { color: colors.text, fontWeight: '900' }]}>
                  {t(item.month)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 7. المرضى الجدد */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('new_patients')}</Text>
        </View>
        {MOCK_NEW_PATIENTS.map((patient, index) => (
          <View
            key={patient.id}
            style={[styles.listItem, index === MOCK_NEW_PATIENTS.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={[styles.listItemIcon, { backgroundColor: colors.success + '20' }]}>
              <Ionicons name="person-add-outline" size={18} color={colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listItemTitle}>{patient.name}</Text>
              <Text style={styles.listItemSubtitle}>{t('join_date_prefix')} {formatLocalizedDate(patient.date, language)}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 8. الشهادات */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('certifications')}</Text>
        </View>
        {MOCK_CERTIFICATIONS.map((cert, index) => (
          <View
            key={cert.id}
            style={[styles.listItem, index === MOCK_CERTIFICATIONS.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={[styles.listItemIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="school-outline" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listItemTitle}>{t(cert.nameKey)}</Text>
              <Text style={styles.listItemSubtitle}>
                {cert.status === 'verified' ? t('certified_status') : t('under_review')}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(cert.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(cert.status) }]}>
                {cert.status === 'verified' ? t('certified_status') : t('pending_status')}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* 9. آخر 5 مواعيد */}
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
              <Text style={styles.listItemIconText}>{apt.patient.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listItemTitle}>{apt.patient}</Text>
              <Text style={styles.listItemSubtitle}>{formatLocalizedDate(apt.date, language)} - {apt.time}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(apt.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(apt.status) }]}>
                {getStatusText(apt.status)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* 10. سجل النشاطات */}
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

    // كارت الدكتور
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

    // الإحصائيات
    statsGrid: {
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    statCard: {
      width: '48%',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      padding: spacing.md,
      alignItems: 'center',
      marginBottom: spacing.sm,
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

    // الأداء
    performanceRow: { marginBottom: spacing.md },
    performanceHeader: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    performanceLabel: { fontSize: fs(13), color: colors.textSecondary, fontWeight: '700' },
    performanceValue: { fontSize: fs(14), fontWeight: '900' },
    progressBar: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: { height: '100%', borderRadius: 4 },

    // الرسم البياني
    chartFilter: {
      backgroundColor: colors.backgroundAlt,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chartFilterText: { fontSize: fs(11), color: colors.textSecondary, fontWeight: '700' },
    chartContainer: {
      height: 180,
      marginTop: spacing.sm,
      marginBottom: spacing.md,
      position: 'relative',
      paddingHorizontal: spacing.sm,
    },
    chartGridLines: {
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 30,
      justifyContent: 'space-between',
    },
    gridLine: { height: 1, backgroundColor: colors.divider, width: '100%' },
    barsContainer: {
      flex: 1, flexDirection: 'row-reverse',
      alignItems: 'flex-end', justifyContent: 'space-between',
      paddingHorizontal: spacing.xs, paddingBottom: 30,
    },
    barWrapper: {
      flex: 1, alignItems: 'center',
      justifyContent: 'flex-end', height: '100%',
    },
    barBackground: {
      width: 24, height: '100%', justifyContent: 'flex-end',
      backgroundColor: colors.backgroundAlt, borderRadius: radius.sm, overflow: 'hidden',
    },
    barFill: { width: '100%', borderRadius: radius.sm },
    barLabel: {
      marginTop: spacing.sm, fontSize: fs(10),
      color: colors.textMuted, fontWeight: '700',
      textAlign: 'center', position: 'absolute', bottom: -22,
    },

    // القوائم
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
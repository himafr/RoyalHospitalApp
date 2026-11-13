import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppHeader from '../../components/layout/AppHeader';
import AppointmentsList from '../../components/AppointmentsList';
import Rotate from '../../components/state/Rotate';
import VerifyMessage from '../../components/VerifyMessage';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ModeContext';
import { lightMode, radius, shadow, spacing } from '../../theme';
import useTodayAppointments from './useTodayAppointments';

const { width } = Dimensions.get('window');

// 1. بيانات وهمية
const MOCK_STATS = [
  { id: 1, title: 'مواعيد اليوم', value: '42', icon: 'calendar-outline', iconColor: '#4A90E2', trend: '+12%', trendColor: '#2E7D5B', sub: 'منذ أمس', bg: '#EBF4FF' },
  { id: 2, title: 'إجمالي المرضى', value: '1,284', icon: 'people-outline', iconColor: '#2E7D5B', trend: '+5', trendColor: '#2E7D5B', sub: 'هذا الأسبوع', bg: '#E8F5E9' },
  { id: 3, title: 'إيرادات اليوم', value: '8,450', icon: 'cash-outline', iconColor: '#C5A059', trend: '-2%', trendColor: '#C0392B', sub: 'منذ أمس', bg: '#FFF8E1', currency: 'ر.س' },
  { id: 4, title: 'المستحقات المتبقية', value: '2,100', icon: 'wallet-outline', iconColor: '#C0392B', trend: '', trendColor: '', sub: 'من 8 مرضى', bg: '#FFEBEE', currency: 'ر.س' },
];

const MOCK_REVENUE = [
  { month: 'يناير', value: 45 },
  { month: 'فبراير', value: 60 },
  { month: 'مارس', value: 40 },
  { month: 'أبريل', value: 70 },
  { month: 'مايو', value: 35 },
  { month: 'يونيو', value: 65, isCurrent: true },
];

const MOCK_NEXT_APPOINTMENT = { patientName: 'سارة الأحمد', time: '10:00 ص', remainingMinutes: 15, service: 'استشارة طبية' };

const MOCK_NEWS = [
  { id: 1, title: 'افتتاح قسم جديد للأشعة', date: 'اليوم', icon: 'megaphone' },
  { id: 2, title: 'تحديث بروتوكولات مكافحة العدوى', date: 'أمس', icon: 'shield-checkmark' },
  { id: 3, title: 'اجتماع طاقم الأطباء يوم الخميس', date: 'قبل يومين', icon: 'calendar' },
];

const MOCK_LATEST_REVIEW = { patientName: 'أحمد المحمدي', rating: 5, comment: 'تجربة ممتازة جداً. الطاقم الطبي محترف والتعامل راقي.' };
const MOCK_PERFORMANCE = { attendanceRate: 92, avgSessionTime: 22 };

const CLINIC_FEATURES = [
  { icon: 'time-outline', title: 'إدارة وقتك', desc: 'نظام مواعيد ذكي يوفر عليك الوقت ويمنع التعارض.' },
  { icon: 'analytics-outline', title: 'متابعة مستمرة', desc: 'تقارير أسبوعية عن أدائك وتقييمات المرضى.' },
  { icon: 'shield-checkmark-outline', title: 'بيانات آمنة', desc: 'ملفات المرضى محمية بأعلى معايير الخصوصية.' },
  { icon: 'cash-outline', title: 'مدفوعات سريعة', desc: 'تحصيل إلكتروني لمستحقاتك أولاً بأول.' },
];

export default function DoctorHomeScreen({ navigation }: any) {
  const { isVerified } = useAuth();
  const { colors } = useTheme();
  const { appointments, count, done, loading, still,refetch } = useTodayAppointments();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [isAvailable, setIsAvailable] = useState(true);

  // حساب أعلى قيمة في الرسم البياني
  const maxRevenue = Math.max(...MOCK_REVENUE.map((r) => r.value));

  const handleContactAdmin = () => {
    Alert.alert('التواصل مع الإدارة', 'اختر طريقة التواصل:', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'مكالمة', onPress: () => Linking.openURL('tel:+201146839894') },
      { text: 'واتساب', onPress: () => Linking.openURL('https://wa.me/201146839894') },
    ]);
  };

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <AppHeader />

      {!isVerified() && (
        <View style={styles.verifyHeader}>
          <VerifyMessage isVerified={isVerified()} navigation={navigation} />
        </View>
      )}

      {/* 1. الهيدر (العنوان + الحالة) */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>لوحة التحكم</Text>
          <Text style={styles.headerSub}>نظرة عامة على أداء العيادة اليوم</Text>
        </View>
        <TouchableOpacity 
          style={[styles.statusBtn, isAvailable ? styles.statusActive : styles.statusInactive]}
          onPress={() => setIsAvailable(!isAvailable)}
        >
          <View style={[styles.statusDot, isAvailable ? styles.dotGreen : styles.dotRed]} />
          <Text style={styles.statusText}>{isAvailable ? 'متاح' : 'إجازة'}</Text>
        </TouchableOpacity>
      </View>

      {/* 2. الموعد القادم */}
      <View style={styles.nextAppointmentCard}>
        <View style={styles.nextHeader}>
          <Ionicons name="time" size={20} color={colors.onPrimary} />
          <Text style={styles.nextTitle}>الموعد القادم</Text>
          <Text style={styles.nextTime}>
            بعد {MOCK_NEXT_APPOINTMENT.remainingMinutes} دقيقة
          </Text>
        </View>
        <View style={styles.nextBody}>
          <View style={styles.avatarMiniLarge}>
            <Text style={styles.avatarTextLarge}>
              {MOCK_NEXT_APPOINTMENT.patientName.charAt(0)}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nextPatientName}>
              {MOCK_NEXT_APPOINTMENT.patientName}
            </Text>
            <Text style={styles.nextDetails}>
              {MOCK_NEXT_APPOINTMENT.service} - {MOCK_NEXT_APPOINTMENT.time}
            </Text>
          </View>
          <TouchableOpacity style={styles.startSessionBtn}>
            <Text style={styles.startSessionText}>ابدأ الجلسة</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. كروت الإحصائيات (Stats Grid) */}
      <View style={styles.statsGrid}>
        {MOCK_STATS.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconBox, { backgroundColor: stat.bg }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.iconColor} />
              </View>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
            <View style={styles.statBody}>
              <Text style={styles.statValue}>
                {stat.value} {stat.currency && <Text style={styles.currencyText}>{stat.currency}</Text>}
              </Text>
              <View style={styles.statFooter}>
                {stat.trend ? (
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                    <Ionicons 
                      name={stat.trend.startsWith('+') ? 'trending-up' : 'trending-down'} 
                      size={14} 
                      color={stat.trendColor} 
                    />
                    <Text style={[styles.trendText, { color: stat.trendColor }]}>{stat.trend}</Text>
                  </View>
                ) : <View />}
                <Text style={styles.statSub}>{stat.sub}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 4. إحصائيات اليوم (Today's Summary) */}
      <View style={styles.todayStatsContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{count}</Text>
          <Text style={styles.summaryLabel}>إجمالي اليوم</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: colors.success }]}>{done.length}</Text>
          <Text style={styles.summaryLabel}>مكتمل</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: colors.warning }]}>{still.length}</Text>
          <Text style={styles.summaryLabel}>في الانتظار</Text>
        </View>
      </View>

      {/* 5. موجز الأخبار */}
      <View style={styles.newsCard}>
        <View style={styles.newsHeader}>
          <Ionicons name="megaphone" size={20} color={colors.icon} />
          <Text style={styles.newsTitle}>موجز أخبار المستشفى</Text>
        </View>
        <FlatList
          data={MOCK_NEWS}
          scrollEnabled={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.newsRow}>
              <Ionicons name={item.icon as any} size={16} color={colors.icon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.newsText}>{item.title}</Text>
                <Text style={styles.newsDate}>{item.date}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* 6. جدول مواعيد اليوم */}
      <AppointmentsList
        loader={
          <Rotate
            component={
              <Ionicons name="refresh-outline" onPress={refetch} color={colors.icon} size={24} />
            }
            rotate={loading}
          />
        }
        data={appointments}
      />

      {/* 7. الرسم البياني (Revenue Chart) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>الإيرادات الشهرية</Text>
          <View style={styles.chartFilter}>
            <Text style={styles.chartFilterText}>آخر 6 أشهر</Text>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.chartGridLines}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.gridLine} />
            ))}
          </View>
          <View style={styles.barsContainer}>
            {MOCK_REVENUE.map((item, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barBackground}>
                  <View 
                    style={[
                      styles.barFill, 
                      { 
                        height: `${(item.value / maxRevenue) * 100}%`,
                        backgroundColor: item.isCurrent ? colors.secondary : colors.primary,
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.barLabel, item.isCurrent && { color: colors.text, fontWeight: '900' }]}>
                  {item.month}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 8. آخر تقييم */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>آخر تقييم من المرضى</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.reviewHeader}>
            <View style={styles.avatarMini}>
              <Text style={styles.avatarText}>
                {MOCK_LATEST_REVIEW.patientName.charAt(0)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewPatientName}>
                {MOCK_LATEST_REVIEW.patientName}
              </Text>
              <View style={{ flexDirection: 'row-reverse' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Ionicons
                    key={s}
                    name={s <= MOCK_LATEST_REVIEW.rating ? 'star' : 'star-outline'}
                    size={14}
                    color={colors.iconActive}
                  />
                ))}
              </View>
            </View>
          </View>
          <Text style={styles.reviewComment}>
            "{MOCK_LATEST_REVIEW.comment}"
          </Text>
        </View>
      </View>

      {/* 9. إحصائيات الأداء */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>إحصائيات الأداء</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.performanceRow}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>نسبة الحضور</Text>
              <Text style={styles.performanceValue}>{MOCK_PERFORMANCE.attendanceRate}%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${MOCK_PERFORMANCE.attendanceRate}%` }]} />
              </View>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>متوسط وقت الجلسة</Text>
              <Text style={styles.performanceValue}>{MOCK_PERFORMANCE.avgSessionTime} دقيقة</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(MOCK_PERFORMANCE.avgSessionTime / 60) * 100}%` }]} />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 10. مزايا العيادة */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>لماذا تعمل معنا؟</Text>
        <Text style={styles.sectionSub}>نوفر لك بيئة عمل متكاملة تساعدك على تقديم أفضل رعاية.</Text>
        <View style={styles.featuresGrid}>
          {CLINIC_FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={24} color={colors.onPrimary} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 11. تواصل مع الإدارة */}
      <TouchableOpacity style={styles.contactAdminBtn} onPress={handleContactAdmin}>
        <Ionicons name="headset" size={20} color={colors.buttonPrimaryText} />
        <Text style={styles.contactAdminText}>تواصل مع الإدارة</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const getStyles = (colors: typeof lightMode) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    verifyHeader: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    // Top bar (Dashboard title + status)
    topBar: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.lg,
    },
    headerTitle: { fontSize: 24, fontWeight: '900', color: colors.text, textAlign: 'right' },
    headerSub: { fontSize: 14, color: colors.textSecondary, textAlign: 'right', marginTop: 4 },
    statusBtn: {
      flexDirection: 'row-reverse', alignItems: 'center',
      paddingHorizontal: spacing.sm, paddingVertical: 6,
      borderRadius: radius.pill, gap: 4,
    },
    statusActive: { backgroundColor: colors.success + '20' },
    statusInactive: { backgroundColor: colors.error + '20' },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    dotGreen: { backgroundColor: colors.success },
    dotRed: { backgroundColor: colors.error },
    statusText: { fontSize: 12, fontWeight: '700', color: colors.text },

    // Next appointment
    nextAppointmentCard: {
      backgroundColor: colors.primary,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      borderRadius: radius.xl,
      padding: spacing.lg,
      borderWidth: 2,
      borderColor: colors.border,
      ...shadow.card,
    },
    nextHeader: {
      flexDirection: 'row-reverse', alignItems: 'center',
      gap: spacing.sm, marginBottom: spacing.md,
    },
    nextTitle: { fontSize: 14, fontWeight: '700', color: colors.onPrimary },
    nextTime: { fontSize: 12, color: colors.onPrimary, opacity: 0.8, marginRight: 'auto' },
    nextBody: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.md },
    avatarMiniLarge: {
      width: 50, height: 50, borderRadius: 25,
      backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center',
      borderWidth: 2, borderColor: colors.border,
    },
    avatarTextLarge: { color: colors.onPrimary, fontWeight: '900', fontSize: 20 },
    nextPatientName: { fontSize: 18, fontWeight: '900', color: colors.onPrimary },
    nextDetails: { fontSize: 13, color: colors.onPrimary, opacity: 0.8, marginTop: 2 },
    startSessionBtn: {
      backgroundColor: colors.secondary,
      paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
      borderRadius: radius.md,
    },
    startSessionText: { color: colors.onSecondary, fontWeight: '900', fontSize: 13 },

    // Stats grid
    statsGrid: {
      flexDirection: 'row-reverse', flexWrap: 'wrap',
      justifyContent: 'space-between', paddingHorizontal: spacing.md,
    },
    statCard: {
      width: '48%', backgroundColor: colors.card, borderRadius: radius.lg,
      padding: spacing.md, marginBottom: spacing.md,
      borderWidth: 1, borderColor: colors.border, ...shadow.card,
    },
    statHeader: {
      flexDirection: 'row-reverse', alignItems: 'center',
      gap: spacing.sm, marginBottom: spacing.md,
    },
    statIconBox: {
      width: 36, height: 36, borderRadius: radius.md,
      justifyContent: 'center', alignItems: 'center',
    },
    statTitle: { fontSize: 13, color: colors.textSecondary, fontWeight: '700', textAlign: 'right' },
    statValue: { fontSize: 22, fontWeight: '900', color: colors.text, textAlign: 'right' },
    currencyText: { fontSize: 12, color: colors.textMuted, fontWeight: '700' },
    statBody: {},
    statFooter: {
      flexDirection: 'row-reverse', justifyContent: 'space-between',
      alignItems: 'center', marginTop: spacing.xs,
    },
    trendText: { fontSize: 11, fontWeight: '700', marginRight: 2 },
    statSub: { fontSize: 11, color: colors.textMuted },

    // Today summary (stats cards in row)
    todayStatsContainer: {
      flexDirection: 'row-reverse', justifyContent: 'space-between',
      paddingHorizontal: spacing.lg, marginBottom: spacing.md,
    },
    summaryCard: {
      flex: 1, backgroundColor: colors.card, padding: spacing.md,
      borderRadius: radius.lg, alignItems: 'center',
      marginHorizontal: 4, ...shadow.card,
    },
    summaryValue: { fontSize: 22, fontWeight: '900', color: colors.text },
    summaryLabel: { fontSize: 11, color: colors.textMuted, marginTop: 4 },

    // News
    newsCard: {
      backgroundColor: colors.card, marginHorizontal: spacing.lg,
      marginBottom: spacing.md, borderRadius: radius.lg, padding: spacing.md,
      borderWidth: 1, borderColor: colors.border, ...shadow.card,
    },
    newsHeader: {
      flexDirection: 'row-reverse', alignItems: 'center',
      gap: spacing.sm, marginBottom: spacing.md,
      borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: spacing.sm,
    },
    newsTitle: { fontSize: 16, fontWeight: '900', color: colors.text },
    newsRow: {
      flexDirection: 'row-reverse', alignItems: 'center',
      gap: spacing.sm, marginBottom: spacing.sm,
    },
    newsText: { fontSize: 14, color: colors.text, fontWeight: '700', textAlign: 'right' },
    newsDate: { fontSize: 11, color: colors.textMuted, textAlign: 'right' },

    // Cards (general)
    card: {
      backgroundColor: colors.card, borderRadius: radius.lg,
      marginBottom: spacing.md, marginHorizontal: spacing.lg,
      ...shadow.card, overflow: 'hidden',
    },
    cardHeader: {
      flexDirection: 'row-reverse', justifyContent: 'space-between',
      alignItems: 'center', padding: spacing.md,
      backgroundColor: colors.cardAlt, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    cardTitle: { fontSize: 16, fontWeight: '900', color: colors.text },
    cardBody: { padding: spacing.md },

    // Review
    reviewHeader: {
      flexDirection: 'row-reverse', alignItems: 'center',
      gap: spacing.md, marginBottom: spacing.sm,
    },
    avatarMini: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
      marginLeft: spacing.md,
    },
    avatarText: { color: colors.onPrimary, fontWeight: '700', fontSize: 14 },
    reviewPatientName: { fontSize: 15, fontWeight: '900', color: colors.text },
    reviewComment: {
      fontSize: 14, color: colors.textSecondary,
      textAlign: 'right', fontStyle: 'italic', lineHeight: 22,
    },

    // Performance
    performanceRow: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
    performanceItem: { width: '48%' },
    performanceLabel: {
      fontSize: 12, color: colors.textMuted,
      textAlign: 'right', marginBottom: 4,
    },
    performanceValue: {
      fontSize: 18, fontWeight: '900', color: colors.text,
      textAlign: 'right', marginBottom: spacing.sm,
    },
    progressBar: {
      height: 8, backgroundColor: colors.border,
      borderRadius: 4, overflow: 'hidden',
    },
    progressFill: { height: '100%', backgroundColor: colors.secondary, borderRadius: 4 },

    // Chart
    chartFilter: {
      backgroundColor: colors.backgroundAlt, paddingHorizontal: spacing.sm, paddingVertical: 4,
      borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border,
    },
    chartFilterText: { fontSize: 11, color: colors.textSecondary, fontWeight: '700' },
    chartContainer: {
      height: 200, marginTop: spacing.sm, marginBottom: spacing.md,
      position: 'relative', paddingHorizontal: spacing.sm,
    },
    chartGridLines: {
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 30,
      justifyContent: 'space-between',
    },
    gridLine: { height: 1, backgroundColor: colors.border, width: '100%' },
    barsContainer: {
      flex: 1, flexDirection: 'row-reverse',
      alignItems: 'flex-end', justifyContent: 'space-between',
      paddingHorizontal: spacing.xs, paddingBottom: 30,
    },
    barWrapper: {
      flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%',
    },
    barBackground: {
      width: 24, height: '100%', justifyContent: 'flex-end',
      backgroundColor: colors.backgroundAlt, borderRadius: radius.sm, overflow: 'hidden',
    },
    barFill: { width: '100%', borderRadius: radius.sm },
    barLabel: {
      marginTop: spacing.sm, fontSize: 10,
      color: colors.textMuted, fontWeight: '700',
      textAlign: 'center', position: 'absolute', bottom: -22,
    },

    // Section (features)
    section: { padding: spacing.lg, backgroundColor: colors.backgroundAlt },
    sectionTitle: { fontSize: 20, fontWeight: '900', color: colors.text },
    sectionSub: {
      fontSize: 14, color: colors.textSecondary,
      marginBottom: spacing.md, textAlign: 'right',
    },
    featuresGrid: {
      flexDirection: 'row-reverse', flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    featureCard: {
      width: '48%', backgroundColor: colors.card, padding: spacing.md,
      borderRadius: radius.lg, marginBottom: spacing.md,
      borderWidth: 1, borderColor: colors.border, alignItems: 'center',
    },
    featureIcon: {
      width: 48, height: 48, borderRadius: 24,
      backgroundColor: colors.primary, justifyContent: 'center',
      alignItems: 'center', marginBottom: spacing.sm,
    },
    featureTitle: { fontSize: 14, fontWeight: '900', color: colors.text, textAlign: 'center', marginBottom: 4 },
    featureDesc: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },

    // Contact admin
    contactAdminBtn: {
      flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center',
      backgroundColor: colors.buttonPrimary, marginHorizontal: spacing.lg,
      padding: spacing.md, borderRadius: radius.md, gap: spacing.sm,
    },
    contactAdminText: { color: colors.buttonPrimaryText, fontWeight: '700', fontSize: 16 },
  });
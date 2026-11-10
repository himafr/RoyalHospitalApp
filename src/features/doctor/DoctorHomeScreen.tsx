import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, spacing, radius, shadow } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import VerifyMessage from '../../components/VerifyMessage';

// 1. بيانات وهمية
const MOCK_NEXT_APPOINTMENT = {
  patientName: 'سارة الأحمد',
  time: '10:00 ص',
  remainingMinutes: 15,
  service: 'استشارة طبية',
};

const MOCK_NEWS = [
  { id: 1, title: 'افتتاح قسم جديد للأشعة', date: 'اليوم', icon: 'megaphone' },
  { id: 2, title: 'تحديث بروتوكولات مكافحة العدوى', date: 'أمس', icon: 'shield-checkmark' },
  { id: 3, title: 'اجتماع طاقم الأطباء يوم الخميس', date: 'قبل يومين', icon: 'calendar' },
];

const MOCK_APPOINTMENTS = [
  { id: 1, patientName: 'سارة الأحمد', time: '10:00 ص', status: 'مؤكد' },
  { id: 2, patientName: 'خالد الفيصل', time: '12:30 م', status: 'مكتمل' },
  { id: 3, patientName: 'نورة العتيبي', time: '02:00 م', status: 'مؤكد' },
  { id: 4, patientName: 'فهد الراشد', time: '04:30 م', status: 'مؤكد' },
];

const MOCK_TODAY_STATS = {
  total: 8,
  completed: 3,
  pending: 5,
};

const MOCK_LATEST_REVIEW = {
  patientName: 'أحمد المحمدي',
  rating: 5,
  comment: 'تجربة ممتازة جداً. الطاقم الطبي محترف والتعامل راقي.',
};

const MOCK_PERFORMANCE = {
  attendanceRate: 92,
  avgSessionTime: 22,
};

const CLINIC_FEATURES = [
  { icon: 'time-outline', title: 'إدارة وقتك', desc: 'نظام مواعيد ذكي يوفر عليك الوقت ويمنع التعارض.' },
  { icon: 'analytics-outline', title: 'متابعة مستمرة', desc: 'تقارير أسبوعية عن أدائك وتقييمات المرضى.' },
  { icon: 'shield-checkmark-outline', title: 'بيانات آمنة', desc: 'ملفات المرضى محمية بأعلى معايير الخصوصية.' },
  { icon: 'cash-outline', title: 'مدفوعات سريعة', desc: 'تحصيل إلكتروني لمستحقاتك أولاً بأول.' },
];

export default function DoctorHomeScreen({ navigation }: any) {
  const { isVerified } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);

  // دالة التواصل مع الإدارة
  const handleContactAdmin = () => {
    Alert.alert(
      'التواصل مع الإدارة',
      'اختر طريقة التواصل:',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'مكالمة', onPress: () => Linking.openURL('tel:+201146839894') },
        { text: 'واتساب', onPress: () => Linking.openURL('https://wa.me/201146839894') },
      ]
    );
  };

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      
      {/* 1. الهيدر */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Ionicons name="medkit" size={22} color={colors.gold} />
        </View>
        <Text style={styles.brand}>عيادة الشفاء</Text>
        <VerifyMessage isVerified={isVerified()} navigation={navigation} />
        
        {/* زرار حالة العيادة */}
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
          <Ionicons name="time" size={20} color={colors.gold} />
          <Text style={styles.nextTitle}>الموعد القادم</Text>
          <Text style={styles.nextTime}>بعد {MOCK_NEXT_APPOINTMENT.remainingMinutes} دقيقة</Text>
        </View>
        <View style={styles.nextBody}>
          <View style={styles.avatarMiniLarge}>
            <Text style={styles.avatarTextLarge}>{MOCK_NEXT_APPOINTMENT.patientName.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nextPatientName}>{MOCK_NEXT_APPOINTMENT.patientName}</Text>
            <Text style={styles.nextDetails}>{MOCK_NEXT_APPOINTMENT.service} - {MOCK_NEXT_APPOINTMENT.time}</Text>
          </View>
          <TouchableOpacity style={styles.startSessionBtn}>
            <Text style={styles.startSessionText}>ابدأ الجلسة</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. إحصائيات اليوم */}
      <View style={styles.todayStatsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{MOCK_TODAY_STATS.total}</Text>
          <Text style={styles.statLabel}>إجمالي اليوم</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.success }]}>{MOCK_TODAY_STATS.completed}</Text>
          <Text style={styles.statLabel}>مكتمل</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.gold }]}>{MOCK_TODAY_STATS.pending}</Text>
          <Text style={styles.statLabel}>في الانتظار</Text>
        </View>
      </View>

      {/* 4. موجز الأخبار */}
      <View style={styles.newsCard}>
        <View style={styles.newsHeader}>
          <Ionicons name="megaphone" size={20} color={colors.gold} />
          <Text style={styles.newsTitle}>موجز أخبار المستشفى</Text>
        </View>
        <FlatList
          data={MOCK_NEWS}
          scrollEnabled={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.newsRow}>
              <Ionicons name={item.icon as any} size={16} color={colors.gold} />
              <View style={{ flex: 1 }}>
                <Text style={styles.newsText}>{item.title}</Text>
                <Text style={styles.newsDate}>{item.date}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* 5. جدول مواعيد اليوم */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>جدول مواعيد اليوم</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllAppointments')}>
            <Text style={styles.linkText}>عرض الكل</Text>
          </TouchableOpacity>
        </View>
        
        {MOCK_APPOINTMENTS.length > 0 ? (
          <FlatList
            data={MOCK_APPOINTMENTS}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.appointmentCard}>
                <View style={styles.avatarMini}>
                  <Text style={styles.avatarText}>{item.patientName.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.patientName}>{item.patientName}</Text>
                  <Text style={styles.appointmentTime}>{item.time}</Text>
                </View>
                <View style={item.status === 'مؤكد' ? styles.badgeGreen : styles.badgeGray}>
                  <Text style={item.status === 'مؤكد' ? styles.badgeText : styles.badgeTextGray}>
                    {item.status}
                  </Text>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={styles.emptyText}>لا توجد مواعيد اليوم.</Text>
        )}
      </View>

      {/* 6. آخر تقييم */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>آخر تقييم من المرضى</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.reviewHeader}>
            <View style={styles.avatarMini}>
              <Text style={styles.avatarText}>{MOCK_LATEST_REVIEW.patientName.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewPatientName}>{MOCK_LATEST_REVIEW.patientName}</Text>
              <View style={{ flexDirection: 'row-reverse' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons key={s} name={s <= MOCK_LATEST_REVIEW.rating ? 'star' : 'star-outline'} size={14} color={colors.gold} />
                ))}
              </View>
            </View>
          </View>
          <Text style={styles.reviewComment}>"{MOCK_LATEST_REVIEW.comment}"</Text>
        </View>
      </View>

      {/* 7. إحصائيات الأداء */}
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

      {/* 8. مزايا العيادة */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>لماذا تعمل معنا؟</Text>
        <Text style={styles.sectionSub}>نوفر لك بيئة عمل متكاملة تساعدك على تقديم أفضل رعاية.</Text>
        
        <View style={styles.featuresGrid}>
          {CLINIC_FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={24} color={colors.gold} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 9. تواصل مع الإدارة */}
      <TouchableOpacity style={styles.contactAdminBtn} onPress={handleContactAdmin}>
        <Ionicons name="headset" size={20} color={colors.white} />
        <Text style={styles.contactAdminText}>تواصل مع الإدارة</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgLight },

  // الهيدر
  header: {
    height: 65,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorder,
    backgroundColor: colors.white,
    gap: spacing.sm,
  },
  logoCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  brand: { fontSize: 16, fontWeight: '900', color: colors.primary },

  // حالة العيادة
  statusBtn: {
    flexDirection: 'row-reverse', alignItems: 'center',
    paddingHorizontal: spacing.sm, paddingVertical: 4,
    borderRadius: radius.pill, gap: 4, marginRight: 'auto',
  },
  statusActive: { backgroundColor: colors.success + '20' },
  statusInactive: { backgroundColor: colors.danger + '20' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  dotGreen: { backgroundColor: colors.success },
  dotRed: { backgroundColor: colors.danger },
  statusText: { fontSize: 12, fontWeight: '700', color: colors.primary },

  // الموعد القادم
  nextAppointmentCard: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gold,
    ...shadow.card,
  },
  nextHeader: {
    flexDirection: 'row-reverse', alignItems: 'center',
    gap: spacing.sm, marginBottom: spacing.md,
  },
  nextTitle: { fontSize: 14, fontWeight: '700', color: colors.gold },
  nextTime: { fontSize: 12, color: colors.textLight, marginRight: 'auto' },
  nextBody: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.md },
  avatarMiniLarge: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.gold,
  },
  avatarTextLarge: { color: colors.gold, fontWeight: '900', fontSize: 20 },
  nextPatientName: { fontSize: 18, fontWeight: '900', color: colors.white },
  nextDetails: { fontSize: 13, color: colors.textLight, marginTop: 2 },
  startSessionBtn: {
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  startSessionText: { color: colors.primary, fontWeight: '900', fontSize: 13 },

  // إحصائيات اليوم
  todayStatsContainer: {
    flexDirection: 'row-reverse', justifyContent: 'space-between',
    padding: spacing.lg, marginTop: -20, zIndex: 10,
  },
  statCard: {
    flex: 1, backgroundColor: colors.white, padding: spacing.md,
    borderRadius: radius.lg, alignItems: 'center', marginHorizontal: 4,
    ...shadow.card,
  },
  statValue: { fontSize: 22, fontWeight: '900', color: colors.primary },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 4 },

  // موجز الأخبار
  newsCard: {
    backgroundColor: colors.white, marginHorizontal: spacing.lg,
    marginTop: spacing.md, borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.goldBorder, ...shadow.card,
  },
  newsHeader: {
    flexDirection: 'row-reverse', alignItems: 'center',
    gap: spacing.sm, marginBottom: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight, paddingBottom: spacing.sm,
  },
  newsTitle: { fontSize: 16, fontWeight: '900', color: colors.primary },
  newsRow: {
    flexDirection: 'row-reverse', alignItems: 'center',
    gap: spacing.sm, marginBottom: spacing.sm,
  },
  newsText: { fontSize: 14, color: colors.primary, fontWeight: '700', textAlign: 'right' },
  newsDate: { fontSize: 11, color: colors.textMuted, textAlign: 'right' },

  // الأقسام
  section: { padding: spacing.lg },
  sectionHeader: {
    flexDirection: 'row-reverse', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: colors.primary },
  sectionSub: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.md, textAlign: 'right' },
  linkText: { color: colors.gold, fontWeight: '700', fontSize: 13 },

  // المواعيد
  appointmentCard: {
    flexDirection: 'row-reverse', alignItems: 'center',
    backgroundColor: colors.white, padding: spacing.md,
    borderRadius: radius.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  avatarMini: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.goldLight, justifyContent: 'center', alignItems: 'center',
    marginLeft: spacing.md,
  },
  avatarText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  patientName: { fontSize: 16, fontWeight: '700', color: colors.primary, textAlign: 'right' },
  appointmentTime: { fontSize: 12, color: colors.textMuted, textAlign: 'right' },
  badgeGreen: {
    backgroundColor: colors.success + '20', paddingHorizontal: spacing.sm,
    paddingVertical: 4, borderRadius: radius.pill,
    borderWidth: 1, borderColor: colors.success + '40',
  },
  badgeText: { color: '#0a7c2b', fontSize: 12, fontWeight: '700' },
  badgeGray: {
    backgroundColor: colors.bgGray, paddingHorizontal: spacing.sm,
    paddingVertical: 4, borderRadius: radius.pill,
  },
  badgeTextGray: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },

  // الكروت
  card: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    marginBottom: spacing.md, marginHorizontal: spacing.lg,
    ...shadow.card, overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row-reverse', justifyContent: 'space-between',
    alignItems: 'center', padding: spacing.md,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  cardTitle: { fontSize: 16, fontWeight: '900', color: colors.primary },
  cardBody: { padding: spacing.md },

  // التقييم
  reviewHeader: {
    flexDirection: 'row-reverse', alignItems: 'center',
    gap: spacing.md, marginBottom: spacing.sm,
  },
  reviewPatientName: { fontSize: 15, fontWeight: '900', color: colors.primary },
  reviewComment: {
    fontSize: 14, color: colors.textSecondary,
    textAlign: 'right', fontStyle: 'italic', lineHeight: 22,
  },

  // الأداء
  performanceRow: {
    flexDirection: 'row-reverse', justifyContent: 'space-between',
  },
  performanceItem: { width: '48%' },
  performanceLabel: { fontSize: 12, color: colors.textMuted, textAlign: 'right', marginBottom: 4 },
  performanceValue: { fontSize: 18, fontWeight: '900', color: colors.primary, textAlign: 'right', marginBottom: spacing.sm },
  progressBar: {
    height: 8, backgroundColor: colors.bgGray,
    borderRadius: 4, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: colors.gold,
    borderRadius: 4,
  },

  // المزايا
  featuresGrid: {
    flexDirection: 'row-reverse', flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%', backgroundColor: colors.white, padding: spacing.md,
    borderRadius: radius.lg, marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.goldBorder, alignItems: 'center',
  },
  featureIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.goldLight, justifyContent: 'center',
    alignItems: 'center', marginBottom: spacing.sm,
  },
  featureTitle: { fontSize: 14, fontWeight: '900', color: colors.primary, textAlign: 'center', marginBottom: 4 },
  featureDesc: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },

  // تواصل مع الإدارة
  contactAdminBtn: {
    flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary, marginHorizontal: spacing.lg,
    padding: spacing.md, borderRadius: radius.md, gap: spacing.sm,
  },
  contactAdminText: { color: colors.white, fontWeight: '700', fontSize: 16 },

  emptyText: { textAlign: 'center', color: colors.textMuted, marginVertical: spacing.md },
});
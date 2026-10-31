import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, spacing, radius, shadow } from '../../theme';
import VerifyMessage from '../../components/VerifyMessage';
import { useAuth } from '../../context/AuthContext';

const features = [
  {
    icon: 'hardware-chip-outline',
    title: 'أحدث المعدات الطبية',
    desc: 'نستخدم أحدث التقنيات وأفضل الأجهزة لضمان التشخيص والعلاج الدقيق والسريع.',
  },
  {
    icon: 'people-outline',
    title: 'فريق طبي متخصص',
    desc: 'أطباء استشاريون ذوو خبرة عالية وشهادات معتمدة في مختلف التخصصات الطبية.',
  },
  {
    icon: 'document-text-outline',
    title: 'متابعة دقيقة للحالات',
    desc: 'نظام ملفات إلكتروني متكامل لمتابعة تاريخك المرضي وتطورات حالتك بدقة متناهية.',
  },
  {
    icon: 'alarm-outline',
    title: 'تذكير تلقائي بالمواعيد',
    desc: 'نرسل رسائل تذكيرية نصية وعبر التطبيق لضمان عدم تفويت مواعيدك المهمة.',
  },
];

const services = [
  {
    icon: 'medkit-outline',
    title: 'الاستشارات الطبية',
    desc: 'احصل على تشخيص دقيق وخطة علاجية مخصصة لحالتك من قبل نخبة من الاستشاريين في كا...',
  },
  {
    icon: 'flask-outline',
    title: 'الإجراءات الطبية',
    desc: 'خدمات التحاليل المخبرية والأشعة والإجراءات البسيطة التي تتم داخل العيادة بأعلى...',
  },
  {
    icon: 'refresh-circle-outline',
    title: 'المتابعة الدورية',
    desc: 'برامج فحص دوري شاملة للأفراد والعائلات للتأكد من الصحة العامة والكشف المبكر',
  },
  {
    icon: 'fitness-outline',
    title: 'برامج العلاج',
    desc: 'خطط علاجية طويلة وقصيرة المدى، تشمل العلاج الطبيعي والتأهيلي تحت إشراف',
  },
];

const testimonials = [
  {
    name: 'أحمد المحمدي',
    text: 'تجربة ممتازة جداً. الطاقم الطبي محترف والتعامل راقي. والأهم من ذلك دقة المواعيد والنظافة العامة للعيادة. أنصح بها بشدة.',
  },
  {
    name: 'سارة العتيبي',
    text: 'أفضل عيادة زرتها. الاهتمام بالتفاصيل والرعاية الإنسانية لا مثيل لها.',
  },
  {
    name: 'خالد الفيصل',
    text: 'خدمة راقية وتشخيص دقيق. أنصح الجميع بزيارة عيادة الشفاء.',
  },
];

export default function PatientHomeScreen({ navigation }: any) {
  const { isVerified , signOut} = useAuth();
  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Ionicons name="medkit" size={22} color={colors.gold} />
        </View>
        <Text style={styles.brand}>عيادة الشفاء </Text>
        <VerifyMessage isVerified={isVerified()} navigation={navigation} />
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          رعاية طبية
          <Text style={{ color: colors.gold }}>باحترافية وثقة</Text>
        </Text>
        <Text style={styles.heroSub}>
          نقدم أفضل الخدمات الطبية بأحدث التقنيات لضمان صحتكم وسلامتكم. فريقنا
          الطبي المتخصص جاهز لخدمتكم على مدار الساعة لضمان راحة بالكم.
        </Text>

        <View style={styles.heroBtns}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('AppointmentTab')}
          >
            <Text style={styles.btnPrimaryText}>احجز موعدك الان</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => navigation.navigate('AboutTab')}
          >
            <Text style={styles.btnSecondaryText}>تعرف علينا</Text>
          </TouchableOpacity>
        </View>

        {/* التقييم والصور الرمزية */}
        <View style={styles.ratingRow}>
          <View style={styles.avatarGroup}>
            {[1, 2, 3].map(i => (
              <View key={i} style={styles.avatarMini}>
                <Ionicons name="person" size={14} color={colors.gold} />
              </View>
            ))}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={{ flexDirection: 'row-reverse' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <Ionicons key={i} name="star" size={12} color={colors.gold} />
              ))}
            </View>
            <Text style={styles.ratingText}>أكثر من 5000 مريض سعيد</Text>
          </View>
        </View>
      </View>

      {/* 3. لماذا تختار عيادتنا؟ (Features) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>لماذا تختار عيادتنا؟</Text>
        <Text style={styles.sectionSub}>
          نتميز بتقديم خدمات طبية عالية الجودة مع التركيز على راحة المريض ودقة
          التشخيص.
        </Text>

        <FlatList
          data={features}
          scrollEnabled={false}
          keyExtractor={i => i.title}
          renderItem={({ item }) => (
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={colors.gold}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDesc}>{item.desc}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* 4. خدماتنا الطبية (Services) */}
      <View style={[styles.section, { backgroundColor: colors.bgGray }]}>
        <View style={styles.servicesHeader}>
          <Text style={styles.sectionTitle}>خدماتنا الطبية</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ServicesTab')}>
            <Text style={styles.linkText}>عرض جميع الخدمات</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionSub}>
          نغطي كافة احتياجاتك الصحية تحت سقف واحد
        </Text>

        <FlatList
          data={services}
          scrollEnabled={false}
          keyExtractor={i => i.title}
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <View style={styles.serviceIconBox}>
                <Ionicons
                  name={item.icon as any}
                  size={28}
                  color={colors.gold}
                />
              </View>
              <Text style={styles.serviceTitle}>{item.title}</Text>
              <Text style={styles.serviceDesc}>{item.desc}</Text>
              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() => navigation.navigate('ServicesTab')}
              >
                <Text style={styles.detailsText}>التفاصيل</Text>
                <Ionicons name="arrow-back" size={14} color={colors.gold} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* 5. آراء المرضى (Testimonials) */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>
          آراء المرضى
        </Text>
        <Text style={[styles.sectionSub, { textAlign: 'center' }]}>
          قصص نجاح مرضانا
        </Text>

        {testimonials.map((t, i) => (
          <View key={i} style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <View style={styles.avatarMini}>
                <Ionicons name="person" size={18} color={colors.gold} />
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.testimonialName}>{t.name}</Text>
                <View style={{ flexDirection: 'row-reverse' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Ionicons
                      key={s}
                      name="star"
                      size={10}
                      color={colors.gold}
                    />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.testimonialText}>"{t.text}"</Text>
          </View>
        ))}
      </View>

      {/* 6. CTA (ابدأ رحلتك) */}
      <View style={styles.cta}>
        <Text style={styles.ctaTitle}>تواصل معنا وابدأ رحلتك العلاجية</Text>
        <Text style={styles.ctaSub}>
          صحتك هي استثمارك الأهم. لا تتردد في التواصل معنا للحصول على استشارة
          فورية أو حجز موعد يناسبك.
        </Text>
        <View style={styles.ctaBtns}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('AppointmentTab')}
          >
            <Text style={styles.ctaBtnText}>احجز موعدك الآن</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaBtnSecondary}
            onPress={() => {
              /* اتصال */
            }}
          >
            <Ionicons name="call" size={20} color={colors.white} />
            <Text style={styles.ctaBtnSecondaryText}>اتصل بنا</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
        <Ionicons name="log-out-outline" size={20} color={colors.white} />
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },

  header: {
    height: 65,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorder,
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
  brand: { fontSize: 18, fontWeight: '900', color: colors.primary },

  hero: {
    padding: spacing.lg,
    backgroundColor: colors.bgLight,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
    lineHeight: 42,
    textAlign: 'right',
  },
  heroSub: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginTop: spacing.md,
    textAlign: 'right',
  },

  heroBtns: {
    flexDirection: 'row-reverse',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  btnPrimaryText: { color: colors.gold, fontWeight: '700', fontSize: 14 },
  btnSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  btnSecondaryText: { color: colors.primary, fontWeight: '700', fontSize: 14 },

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
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  ratingText: { color: colors.primary, fontSize: 12, fontWeight: '700' },

  section: { padding: spacing.lg },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
    textAlign: 'right',
    marginBottom: spacing.xs,
  },
  sectionSub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },

  featureCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.goldLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
    textAlign: 'right',
  },
  featureDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
    lineHeight: 20,
  },

  servicesHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: { color: colors.gold, fontWeight: '700', fontSize: 14 },
  detailsBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 4,
  },
  detailsText: { color: colors.gold, fontWeight: '700', fontSize: 14 },

  serviceCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    marginBottom: spacing.md,
  },
  serviceIconBox: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.bgLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
    textAlign: 'right',
    marginBottom: spacing.xs,
  },
  serviceDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    lineHeight: 22,
  },

  testimonialCard: {
    backgroundColor: colors.bgGray,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    marginBottom: spacing.md,
  },
  testimonialHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  testimonialName: { fontSize: 15, fontWeight: '900', color: colors.primary },
  testimonialText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'right',
    fontStyle: 'italic',
  },

  cta: {
    margin: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.goldBorder,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center',
    lineHeight: 32,
  },
  ctaSub: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginVertical: spacing.sm,
    lineHeight: 22,
  },
  ctaBtns: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaBtn: {
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  ctaBtnText: { color: colors.primary, fontWeight: '900', fontSize: 16 },
  ctaBtnSecondary: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  ctaBtnSecondaryText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  
  logoutBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    margin: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  logoutText: { color: colors.white, fontWeight: '700', fontSize: 16 }
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, radius, shadow } from '../../theme';

export default function DoctorHomeScreen({ navigation }: any) {
  const { email, signOut } = useAuth();

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={colors.gold} />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={styles.welcomeTitle}>
            أهلاً بك، د. {email?.split('@')[0]}
          </Text>
          <Text style={styles.welcomeSub}>
            نتمنى لك يوماً سعيداً وموفقاً في خدمة مرضاك.
          </Text>
        </View>
      </View>

      <View style={styles.briefContainer}>
        <View style={styles.briefCard}>
          <Ionicons name="people" size={24} color={colors.success} />
          <Text style={styles.briefValue}>1,250</Text>
          <Text style={styles.briefLabel}>إجمالي المرضى</Text>
        </View>
        <View style={styles.briefCard}>
          <Ionicons name="star" size={24} color={colors.gold} />
          <Text style={styles.briefValue}>4.9 / 5</Text>
          <Text style={styles.briefLabel}>متوسط التقييم</Text>
        </View>
        <View style={styles.briefCard}>
          <Ionicons name="trophy" size={24} color={colors.primary} />
          <Text style={styles.briefValue}>15+</Text>
          <Text style={styles.briefLabel}>سنوات الخبرة</Text>
        </View>
      </View>

      {/* 🟢 جدول مواعيد اليوم */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>جدول مواعيد اليوم</Text>
          <TouchableOpacity
            onPress={() => {
              /* الانتقال لكل المواعيد */
            }}
          >
            <Text style={styles.linkText}>عرض الكل</Text>
          </TouchableOpacity>
        </View>

        {/* مواعيد وهمية للشكل */}
        <View style={styles.appointmentCard}>
          <View style={styles.doctorAvatarMini}>
            <Text style={styles.avatarText}>سأ</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.patientName}>سارة الأحمد</Text>
            <Text style={styles.appointmentTime}>10:00 ص</Text>
          </View>
          <View style={styles.badgeGreen}>
            <Text style={styles.badgeText}>مؤكد</Text>
          </View>
        </View>

        <View style={styles.appointmentCard}>
          <View style={styles.doctorAvatarMini}>
            <Text style={styles.avatarText}>خف</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.patientName}>خالد الفيصل</Text>
            <Text style={styles.appointmentTime}>12:30 م</Text>
          </View>
          <View style={styles.badgeGray}>
            <Text style={styles.badgeTextGray}>مكتمل</Text>
          </View>
        </View>
      </View>

      {/* 🟢 إدارة الملف المهني */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>إدارة الملف المهني</Text>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            /* اذهب لشاشة الشهادات */
          }}
        >
          <Ionicons name="school" size={20} color={colors.gold} />
          <Text style={styles.actionBtnText}>إدارة الشهادات العلمية</Text>
          <Ionicons name="chevron-back" size={20} color={colors.gold} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            /* اذهب لشاشة تحديث البيانات */
          }}
        >
          <Ionicons name="create" size={20} color={colors.gold} />
          <Text style={styles.actionBtnText}>تعديل المعلومات المهنية</Text>
          <Ionicons name="chevron-back" size={20} color={colors.gold} />
        </TouchableOpacity>
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
  root: { flex: 1, backgroundColor: colors.bgLight },

  welcomeCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    gap: spacing.md,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.gold,
  },
  welcomeTitle: { fontSize: 20, fontWeight: '900', color: colors.white },
  welcomeSub: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'right',
  },

  briefContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    padding: spacing.lg,
    marginTop: -20,
    zIndex: 10,
  },
  briefCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginHorizontal: 4,
    ...shadow.card,
  },
  briefValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
    marginTop: spacing.xs,
  },
  briefLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  section: { padding: spacing.lg },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primary,
    textAlign: 'right',
  },
  linkText: { color: colors.gold, fontWeight: '700', fontSize: 13 },

  appointmentCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  doctorAvatarMini: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.goldLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  avatarText: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
  },
  appointmentTime: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
  },
  badgeGreen: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.success + '40',
  },
  badgeText: { color: '#0a7c2b', fontSize: 12, fontWeight: '700' },
  badgeGray: {
    backgroundColor: colors.bgGray,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  badgeTextGray: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },

  actionBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    gap: spacing.sm,
  },
  actionBtnText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
  },

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
  logoutText: { color: colors.white, fontWeight: '700', fontSize: 16 },
});

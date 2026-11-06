import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, radius, shadow } from '../../theme';
import useDoctor from './useDoctor';
import AddCertificationForm from './AddCertificationForm';
import EditCertificationForm from './EditCertificationForm';
import EditCareerDetailsForm from './EditCareerDetailsForm';

export default function DoctorProfileScreen({ navigation }: any) {
  const { email, signOut } = useAuth();
  const { doctor: user, loading, refetch,error } = useDoctor();

  // دالة مساعدة لعرض حقل
  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || 'غير محدد'}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.root}
    refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
    showsVerticalScrollIndicator={false}>
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
          <Text>{JSON.stringify(error)}</Text>
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

      {/* 3. المعلومات المهنية */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>المعلومات المهنية</Text>
        </View>
        <View style={styles.cardBody}>
          <InfoItem label="التخصص" value={user?.specialty || 'غير محدد'} />
          <InfoItem
            label="المسمى الوظيفي"
            value={user?.specialization || 'غير محدد'}
          />
          <InfoItem label="العضويات المهنية" value={user?.work || 'غير محدد'} />

          <Text style={styles.label}>نبذة عن الطبيب</Text>
          <Text style={styles.aboutText}>
            {user?.about || 'لم يتم إضافة نبذة بعد.'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
           navigation.navigate('EditModal', {
                title: 'تعديل المعلومات المهنية',
                renderContent: (nav: any) => (
                <EditCareerDetailsForm
                    refetchData={refetch}
                    navigation={nav}
                  />
                ),
              })
          }}
        >
          <Ionicons name="create" size={20} color={colors.gold} />
          <Text style={styles.actionBtnText}>تعديل المعلومات المهنية</Text>
          <Ionicons name="chevron-back" size={20} color={colors.gold} />
        </TouchableOpacity>
      </View>

      {/* 5. الشهادات العلمية */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>الشهادات العلمية</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EditModal', {
                title: 'اضافة شهاده',
                renderContent: (nav: any) => (
                  <AddCertificationForm
                    refetchData={refetch}
                    navigation={nav}
                  />
                ),
              })
            }
          >
            <Ionicons name="add" size={24} color={colors.gold} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          {user?.certifications && user.certifications.length > 0 ? (
            user.certifications.map((cert: any, index: number) => (
              <View key={index} style={styles.certItem}>
                <View style={styles.certIcon}>
                  <Ionicons name="school" size={18} color={colors.gold} />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certOrg}>
                    {cert.organization} - {cert.place}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(
                      'EditModal',

                      {
                        title: 'تعديل الشهاده العلمية',
                        renderContent: (nav: any) => (
                          <EditCertificationForm
                            navigation={nav}
                            refetchData={refetch}
                            certId={cert.id}
                          />
                        ),
                      },
                    )
                  }
                >
                  <Ionicons name="pencil" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>لم يتم إضافة شهادات بعد.</Text>
          )}
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
  root: { flex: 1, backgroundColor: colors.bgLight },

  welcomeCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: spacing.lg,
    marginBottom: spacing.md,

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

    borderEndEndRadius: radius.md,
    borderEndStartRadius: radius.md,
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

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    ...shadow.card,
    overflow: 'hidden',
    marginHorizontal: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  cardTitle: { fontSize: 16, fontWeight: '900', color: colors.primary },
  cardBody: { padding: spacing.md },

  infoItem: { marginBottom: spacing.md },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
    textAlign: 'right',
  },

  label: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
    marginBottom: 4,
  },
  aboutText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    lineHeight: 22,
  },
  certItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.bgGray,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  certIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.goldLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  certName: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primary,
    textAlign: 'right',
  },
  certOrg: { fontSize: 12, color: colors.textMuted, textAlign: 'right' },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    marginVertical: spacing.md,
  },
});

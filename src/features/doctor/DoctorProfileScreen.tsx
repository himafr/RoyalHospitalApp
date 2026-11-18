import { createDirectionalStyles } from '../../utils/direction';
import React, { useMemo } from 'react';
import {
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SmoothScrollView from '../../components/SmoothScrollView';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ModeContext';
import { lightMode, radius, shadow, spacing } from '../../theme';
import AddCertificationForm from './AddCertificationForm';
import EditCareerDetailsForm from './EditCareerDetailsForm';
import EditCertificationForm from './EditCertificationForm';
import useDoctor from './useDoctor';
import { SPECIALTY_TRANSLATION_KEYS } from '../../constants';

export default function DoctorProfileScreen({ navigation }: any) {
  const { colors,fontScale,t, isRTL} = useTheme();
const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);
  const { email, signOut, photoUrl } = useAuth();
  const { doctor: user, loading, refetch,error } = useDoctor();

  // دالة مساعدة لعرض حقل
  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || t('not_specified')}</Text>
    </View>
  );

  return (
    <SmoothScrollView style={styles.root}
    refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
    showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeCard}>
        <View style={styles.avatar}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={40} color={colors.primary} />
          )}
        </View>
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <Text style={styles.welcomeTitle}>
            {t('welcome_doctor')} {email?.split('@')[0]}
          </Text>
          <Text style={styles.welcomeSub}>
            {t('doctor_welcome_desc')}
          </Text>
        </View>
      </View>

      <View style={styles.briefContainer}>
        <View style={styles.briefCard}>
          <Ionicons name="people" size={24} color={colors.success} />
          <Text style={styles.briefValue}>1,250</Text>
          <Text style={styles.briefLabel}>{t('total_patients')}</Text>
        </View>
        <View style={styles.briefCard}>
          <Ionicons name="star" size={24} color={colors.primary} />
          <Text style={styles.briefValue}>4.9 / 5</Text>
          <Text style={styles.briefLabel}>{t('avg_rating')}</Text>
        </View>
        <View style={styles.briefCard}>
          <Ionicons name="trophy" size={24} color={colors.primary} />
          <Text style={styles.briefValue}>15+</Text>
          <Text style={styles.briefLabel}>{t('years_experience')}</Text>
        </View>
      </View>


      {/* 3. المعلومات المهنية */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{t('professional_info')}</Text>
        </View>
        <View style={styles.cardBody}>
          <InfoItem
            label={t('specialty')}
            value={user?.specialty
              ? t(SPECIALTY_TRANSLATION_KEYS[user.specialty] || 'specialty')
              : t('not_specified')}
          />
          <InfoItem
            label={t('job_title')}
            value={user?.specialization || t('not_specified')}
          />
          <InfoItem label={t('memberships')} value={user?.work || t('not_specified')} />

          <Text style={styles.label}>{t('about_doctor')}</Text>
          <Text style={styles.aboutText}>
            {user?.about || t('no_biography')}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
           navigation.navigate('EditModal', {
                title: t('edit_professional_info'),
                renderContent: (nav: any) => (
                <EditCareerDetailsForm
                    refetchData={refetch}
                    navigation={nav}
                  />
                ),
              })
          }}
        >
          <Ionicons name="create" size={20} color={colors.primary} />
          <Text style={styles.actionBtnText}>{t('edit_professional_info')}</Text>
          <Ionicons
            name={isRTL ? 'chevron-back' : 'chevron-forward'}
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* 5. الشهادات العلمية */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{t('certifications')}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EditModal', {
                title: t('add_certification'),
                renderContent: (nav: any) => (
                  <AddCertificationForm
                    refetchData={refetch}
                    navigation={nav}
                  />
                ),
              })
            }
          >
            <Ionicons name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          {user?.certifications && user.certifications.length > 0 ? (
            user.certifications.map((cert: any, index: number) => (
              <View key={index} style={styles.certItem}>
                {cert.photo ? (
                  <Image source={{ uri: cert.photo }} style={styles.certPhoto} />
                ) : (
                  <View style={styles.certIcon}>
                    <Ionicons name="school" size={18} color={colors.primary} />
                  </View>
                )}
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
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
                        title: t('edit_certification'),
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
            <Text style={styles.emptyText}>{t('no_certifications')}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
        <Ionicons name="log-out-outline" size={20} color={colors.iconSecondary} />
        <Text style={styles.logoutText}>{t('logout')}</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </SmoothScrollView>
  );
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },

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
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.onPrimary,
      overflow: 'hidden',
    },
    avatarImage: { width: '100%', height: '100%' },
    welcomeTitle: { fontSize: 20 * fontScale, fontWeight: '900', color: colors.onPrimary },
    welcomeSub: {
      fontSize: 13 * fontScale,
      color: colors.onPrimary,
      opacity: 0.8,
      marginTop: 4,
       
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
      backgroundColor: colors.card,
      padding: spacing.md,
      borderRadius: radius.lg,
      alignItems: 'center',
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow.card,
    },
    briefValue: {
      fontSize: 18 * fontScale,
      fontWeight: '900',
      color: colors.text,
      marginTop: spacing.xs,
    },
    briefLabel: { fontSize: 11 * fontScale, color: colors.textMuted, marginTop: 2 },

    section: { padding: spacing.lg },
    sectionHeader: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: 20 * fontScale,
      fontWeight: '900',
      color: colors.text,
       
    },
    linkText: { color: colors.link, fontWeight: '700', fontSize: 13 * fontScale },

    appointmentCard: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: spacing.md,
      borderRadius: radius.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    doctorAvatarMini: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.secondaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: spacing.md,
    },
    avatarText: { color: colors.text, fontWeight: '700', fontSize: 12 * fontScale },
    patientName: {
      fontSize: 16 * fontScale,
      fontWeight: '700',
      color: colors.text,
       
    },
    appointmentTime: {
      fontSize: 12 * fontScale,
      color: colors.textMuted,
       
    },
    badgeGreen: {
      backgroundColor: colors.success + '20',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.success + '40',
    },
    badgeText: { color: colors.success, fontSize: 12 * fontScale, fontWeight: '700' },
    badgeGray: {
      backgroundColor: colors.cardAlt,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.pill,
    },
    badgeTextGray: { color: colors.textMuted, fontSize: 12 * fontScale, fontWeight: '700' },

    actionBtn: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: spacing.md,
      borderEndEndRadius: radius.md,
      borderEndStartRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.sm,
    },
    actionBtnText: {
      flex: 1,
      fontSize: 15 * fontScale,
      fontWeight: '700',
      color: colors.text,
       
    },

    logoutBtn: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.error,
      margin: spacing.lg,
      padding: spacing.md,
      borderRadius: radius.md,
      gap: spacing.sm,
    },
    logoutText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 * fontScale },

    card: {
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow.card,
      overflow: 'hidden',
      marginHorizontal: spacing.lg,
    },
    cardHeader: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
      backgroundColor: colors.cardAlt,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    cardTitle: { fontSize: 16 * fontScale, fontWeight: '900', color: colors.text },
    cardBody: { padding: spacing.md },

    infoItem: { marginBottom: spacing.md },
    infoLabel: {
      fontSize: 12 * fontScale,
      color: colors.textMuted,
       
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 14 * fontScale,
      color: colors.text,
      fontWeight: '700',
       
    },

    label: {
      fontSize: 12 * fontScale,
      color: colors.textMuted,
       
      marginBottom: 4,
    },
    aboutText: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
       
      lineHeight: 22,
    },
    certItem: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: colors.cardAlt,
      padding: spacing.md,
      borderRadius: radius.md,
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    certIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.secondaryLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    certPhoto: { width: 36, height: 36, borderRadius: 18 },
    certName: {
      fontSize: 15 * fontScale,
      fontWeight: '900',
      color: colors.text,
       
    },
    certOrg: { fontSize: 12 * fontScale, color: colors.textMuted,   },
    emptyText: {
      textAlign: 'center',
      color: colors.textMuted,
      marginVertical: spacing.md,
    },
  });
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
import SmallIndicator from '../../components/SmallIndicator';
import SmoothScrollView from '../../components/SmoothScrollView';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ModeContext';
import useUser from '../../hooks/useUser';
import { lightMode, radius, shadow, spacing } from '../../theme';
import BloodTypeForm from './BloodTypeForm';
import ChangePasswordForm from './ChangePasswordForm';
import EmergencyContactForm from './EmergencyContactForm';
import PersonalDetailsForm from './PersonalDetailsForm';
import usePatient from './usePatient';
import NavBar from '../../components/layout/NavBar';

export default function PatientProfileScreen({ navigation }: any) {
  const { colors,fontScale,t, isRTL} = useTheme();
const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);
  const { email, fullName, photoUrl } = useAuth();
  const { data: user, loading, refetch } = useUser();
  const {
    loading: patientLoading,
    patient,
    refetch: patientRefetch,
    medicalRecord,
  } = usePatient();

  return (
    <>
    <NavBar navigation={navigation} title={t('patient_profile')} />

    <View style={styles.appHeader}>
      <View style={styles.welcomeHeader}>
        <View style={styles.avatar}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={40} color={colors.primary} />
          )}
        </View>
        <View style={styles.flexAlignmentItem}>
          <Text style={styles.welcomeTitle}>
            {t('welcome_patient')} {fullName || email?.split('@')[0]}
          </Text>
          <Text style={styles.welcomeSub}>{t('gold_patient')}</Text>
        </View>
      </View>
    </View>

      <SmoothScrollView
        style={styles.root}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t('personal_info')}</Text>
            <TouchableOpacity
              disabled={loading}
              onPress={() =>
                navigation.navigate('EditModal', {
                  title: t('edit_personal_info'),
                  renderContent: (nav: any) => (
                    <PersonalDetailsForm
                      refreshData={refetch}
                      navigation={nav}
                    />
                  ),
                })
              }
            >
              <Ionicons name="pencil" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>{t('full_name')}</Text>
              <Text style={styles.infoValue}>
              {loading ? <SmallIndicator /> : user?.fullName || t('not_specified')}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>{t('email')}</Text>
              <Text style={styles.infoValue}>
              {loading ? <SmallIndicator /> : email || t('not_specified')}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>{t('phone')}</Text>
              <Text style={styles.infoValue}>
              {loading ? <SmallIndicator /> : user?.phoneNumber || t('not_specified')}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>{t('date_of_birth')}</Text>
              <Text style={styles.infoValue}>
              {loading ? <SmallIndicator /> : user?.dateOfBirth || t('not_specified')}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>{t('gender')}</Text>
              <Text style={styles.infoValue}>
              {loading ? <SmallIndicator /> : user?.gender || t('not_specified')}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>{t('address')}</Text>
              <Text style={styles.infoValue}>
              {loading ? <SmallIndicator /> : user?.address || t('not_specified')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t('my_appointments')}</Text>
            <TouchableOpacity>
              <Ionicons name="eye" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>{t('no_scheduled_appointments')}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t('medical_record')}</Text>
            <TouchableOpacity
              disabled={loading}
              onPress={() =>
                navigation.navigate('EditModal', {
                  title: t('blood_type'),
                  renderContent: (nav: any) => (
                    <BloodTypeForm
                      refreshData={patientRefetch}
                      navigation={nav}
                    />
                  ),
                })
              }
            >
              <Ionicons name="pencil" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.rowBetween}>
              <Text style={styles.infoLabel}>{t('blood_type')}</Text>
              <View style={styles.badgeGreen}>
                <Text style={styles.badgeGreenText}>
                  {patient?.bloodType || t('unknown')}
                </Text>
              </View>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.infoLabel}>{t('allergies')}</Text>
              <Text style={styles.infoValue}>
                {loading ? (
                  <SmallIndicator />
                ) : (
                  medicalRecord?.allergies.map(v => v.allergy).join(' ,') ||
                  t('no_allergies')
                )}
              </Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.infoLabel}>{t('chronic_diseases')}</Text>
              <Text style={styles.infoValue}>
                {' '}
                {loading ? (
                  <SmallIndicator />
                ) : (
                  medicalRecord?.chronicDiseases
                    .map(v => v.disease)
                    .join(' ,') || t('no_chronic')
                )}
              </Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.infoLabel}>{t('current_medications')}</Text>
              <Text style={styles.infoValue}>
                {' '}
                {loading ? (
                  <SmallIndicator />
                ) : (
                  medicalRecord?.medications
                    .map(v => v.medications)
                    .join(' ,') || t('no_medications')
                )}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t('emergency_contact')}</Text>
            <TouchableOpacity
              disabled={patientLoading}
              onPress={() =>
                navigation.navigate('EditModal', {
                  title: t('edit_emergency_contact'),
                  renderContent: (nav: any) => (
                    <EmergencyContactForm
                      refreshData={patientRefetch}
                      navigation={nav}
                    />
                  ),
                })
              }
            >
              <Ionicons name="pencil" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.rowBetween}>
              <Text style={styles.infoLabel}>{t('name')}</Text>
              <Text style={styles.infoValue}>
                {patientLoading ? (
                  <SmallIndicator />
                ) : (
                  patient?.emergencyContactName || t('not_specified')
                )}
              </Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.infoLabel}>{t('phone')}
              </Text>
              <Text style={styles.infoValue}>
                {patientLoading ? (
                  <SmallIndicator />
                ) : (
                  patient?.emergencyContactPhone || t('not_specified')
                )}
              </Text>
            </View>
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                {t('emergency_warning')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t('change_password')}</Text>
          </View>
          <View style={styles.cardBody}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                navigation.navigate('EditModal', {
                  title: t('update_password'),
                  renderContent: (nav: any) => (
                    <ChangePasswordForm
                      refreshData={refetch}
                      navigation={nav}
                    />
                  ),
                });
              }}
            >
              <Ionicons name="lock-closed" size={20} color={colors.primary} />
              <Text style={styles.actionText}>{t('update_password')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomHeight} />
      </SmoothScrollView>
    </>
  );
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    appHeader:{backgroundColor:colors.background},
    root: { flex: 1, backgroundColor: colors.background, padding: spacing.md,paddingTop:spacing.xs },

    welcomeHeader: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: colors.primary,
      marginTop: spacing.md,
      padding: spacing.lg,
      borderRadius: radius.xl,
      gap: spacing.md,
      marginHorizontal: spacing.md,
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
      fontSize: 14 * fontScale,
      color: colors.onPrimary,
      opacity: 0.8,
      fontWeight: '700',
    },

    card: {
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow.card,
      overflow: 'hidden',
    },
    flexAlignmentItem: { flex: 1, alignItems: 'flex-end' },
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

    infoGrid: {
      padding: spacing.md,
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    infoItem: { width: '48%', marginBottom: spacing.md },
    infoLabel: {
      fontSize: 12 * fontScale,
      color: colors.textMuted,
      textAlign: 'right',
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 14 * fontScale,
      color: colors.text,
      fontWeight: '700',
      textAlign: 'right',
    },

    rowBetween: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
      paddingBottom: 8,
    },
    badgeGreen: {
      backgroundColor: colors.success + '20',
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.sm,
    },
    badgeGreenText: { color: colors.success, fontWeight: '700', fontSize: 12 * fontScale },

    warningBox: {
      backgroundColor: colors.warning + '20',
      padding: spacing.sm,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.warning + '60',
      marginTop: spacing.sm,
    },
    warningText: {
      fontSize: 12 * fontScale,
      color: colors.warning,
      textAlign: 'right',
      fontWeight: '700',
    },

    emptyBox: { padding: spacing.lg, alignItems: 'center' },
    emptyText: { color: colors.textMuted, fontSize: 14 * fontScale },

    actionButton: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.cardAlt,
      padding: spacing.md,
      borderRadius: radius.md,
      gap: spacing.sm,
    },
    actionText: { color: colors.text, fontWeight: '700', fontSize: 16 * fontScale },
    bottomHeight: { height: 120 },
  });
import { createDirectionalStyles } from '../utils/direction';
import { ReactNode, useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Appointment } from '../../types/medical';
import { useTheme } from '../context/ModeContext';
import { lightMode, radius, spacing } from '../theme';

const AppointmentsList: React.FC<{ data: Appointment[],loader?:ReactNode }> = ({ data,loader }) => {
  const { colors,fontScale,t, isRTL} = useTheme();
const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);
  function getStatusBadge(status: string) {
    switch (status) {
      case 'PENDING':
        return (
          <View style={styles.badgeOrange}>
            <Text style={styles.badgeTextOrange}> {t("status_pending")}</Text>
          </View>
        );
      case 'CONFIRMED':
        return (
          <View style={styles.badgeGreen}>
            <Text style={styles.badgeTextGreen}>{t("status_confirmed")}</Text>
          </View>
        );
      case 'CANCELLED':
        return (
          <View style={styles.badgeRed}>
            <Text style={styles.badgeTextRed}>{t("status_cancelled")}</Text>
          </View>
        );
      case 'COMPLETED':
        return (
          <View style={styles.badgeBlue}>
            <Text style={styles.badgeTextBlue}>{t("status_completed")}</Text>
          </View>
        );
      default:
        return null;
    }
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t("today_appointments")}
          {JSON.stringify(AppointmentsList)}
        </Text>
        {loader&& loader}
      </View>

      {data.length?data.map(appointment => (
        <View  key={appointment.id} style={styles.appointmentCard}>
            <Image source={{uri:appointment.patientPhoto}} style={styles.doctorAvatarMini} />
          <View style={{ flex: 1 }}>
            <Text style={styles.patientName}>{appointment.patientFullName}</Text>
            <Text style={styles.appointmentTime}>
              {appointment.appointmentTime}
            </Text>
          </View>
          {getStatusBadge(appointment.status)}
        </View>
      )): (
                <Text style={styles.emptyText}>{t("no_scheduled_appointments")}</Text>
              )}

    </View>
  );
};

export default AppointmentsList;

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
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
      textAlign: 'right',
    },
    linkText: { color: colors.link, fontWeight: '700', fontSize: 13 * fontScale },
    emptyText: {
      textAlign: 'center',
      color: colors.textMuted,
      marginVertical: spacing.md,
    },
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
      textAlign: 'right',
    },
    appointmentTime: {
      fontSize: 12 * fontScale,
      color: colors.textMuted,
      textAlign: 'right',
    },

    badgeOrange: {
      backgroundColor: colors.warning + '20',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.warning + '40',
    },
    badgeTextOrange: {
      color: colors.warning,
      fontSize: 12 * fontScale,
      fontWeight: '700',
    },

    badgeGreen: {
      backgroundColor: colors.success + '20',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.success + '40',
    },
    badgeTextGreen: {
      color: colors.success,
      fontSize: 12 * fontScale,
      fontWeight: '700',
    },

    badgeRed: {
      backgroundColor: colors.error + '20',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.error + '40',
    },
    badgeTextRed: {
      color: colors.error,
      fontSize: 12 * fontScale,
      fontWeight: '700',
    },

    badgeBlue: {
      backgroundColor: colors.info + '20',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.info + '40',
    },
    badgeTextBlue: {
      color: colors.info,
      fontSize: 12 * fontScale,
      fontWeight: '700',
    },
  });
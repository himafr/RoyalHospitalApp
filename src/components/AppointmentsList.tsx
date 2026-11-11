import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { Appointment } from '../../types/medical';
import { ReactNode } from 'react';

const AppointmentsList: React.FC<{ data: Appointment[],loader?:ReactNode }> = ({ data,loader }) => {
  function getStatusBadge(status: string) {
    switch (status) {
      case 'PENDING':
        return (
          <View style={styles.badgeOrange}>
            <Text style={styles.badgeTextOrange}>قيد الانتظار</Text>
          </View>
        );
      case 'CONFIRMED':
        return (
          <View style={styles.badgeGreen}>
            <Text style={styles.badgeTextGreen}>مؤكد</Text>
          </View>
        );
      case 'CANCELLED':
        return (
          <View style={styles.badgeRed}>
            <Text style={styles.badgeTextRed}>ملغى</Text>
          </View>
        );
      case 'COMPLETED':
        return (
          <View style={styles.badgeBlue}>
            <Text style={styles.badgeTextBlue}>مكتمل</Text>
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
          جدول مواعيد اليوم
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
                <Text style={styles.emptyText}>لا توجد مواعيد اليوم.</Text>
              )}

    </View>
  );
};

export default AppointmentsList;

const styles = StyleSheet.create({
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
 emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    marginVertical: spacing.md,
  },
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

  badgeOrange: {
    backgroundColor: '#f97316' + '20',
    paddingHorizontal: spacing?.sm || 12,
    paddingVertical: 4,
    borderRadius: radius?.pill || 20,
    borderWidth: 1,
    borderColor: '#f97316' + '40',
  },
  badgeTextOrange: {
    color: '#c2410c',
    fontSize: 12,
    fontWeight: '700',
  },

  badgeGreen: {
    backgroundColor: (colors?.success || '#22c55e') + '20',
    paddingHorizontal: spacing?.sm || 12,
    paddingVertical: 4,
    borderRadius: radius?.pill || 20,
    borderWidth: 1,
    borderColor: (colors?.success || '#22c55e') + '40',
  },
  badgeTextGreen: {
    color: '#15803d',
    fontSize: 12,
    fontWeight: '700',
  },

  badgeRed: {
    backgroundColor: '#ef4444' + '20',
    paddingHorizontal: spacing?.sm || 12,
    paddingVertical: 4,
    borderRadius: radius?.pill || 20,
    borderWidth: 1,
    borderColor: '#ef4444' + '40',
  },
  badgeTextRed: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '700',
  },

  badgeBlue: {
    backgroundColor: '#3b82f6' + '20',
    paddingHorizontal: spacing?.sm || 12,
    paddingVertical: 4,
    borderRadius: radius?.pill || 20,
    borderWidth: 1,
    borderColor: '#3b82f6' + '40',
  },
  badgeTextBlue: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: '700',
  },
});

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ModeContext';
import { lightMode, radius, shadow, spacing } from '../../theme';
import useAllAppointments from './useAllAppointments';

export default function DoctorAllAppointmentsScreen({ navigation }: any) {
  const { colors,fontScale } = useTheme();
  const styles = useMemo(() => getStyles(colors,fontScale), [colors,fontScale]);
  const { appointments, loading, page, totalPages, goToPage } = useAllAppointments();

  // دالة مساعدة لعرض حالة الحجز بلون
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'مؤكد':
        return { bg: colors.success + '20', text: colors.success };
      case 'COMPLETED':
      case 'مكتمل':
        return { bg: colors.info + '20', text: colors.info };
      case 'CANCELLED':
      case 'ملغي':
        return { bg: colors.error + '20', text: colors.error };
      default:
        return { bg: colors.textMuted + '20', text: colors.textMuted };
    }
  };

  const renderAppointment = ({ item }: any) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          {/* المريض */}
          <View style={styles.patientInfo}>
            <View style={styles.avatarMini}>
              <Text style={styles.avatarText}>{item.patientName?.charAt(0) || '?'}</Text>
            </View>
            <View>
              <Text style={styles.patientName}>{item.patientName || 'مريض'}</Text>
              <Text style={styles.patientPhone}>{item.patientPhone || '—'}</Text>
            </View>
          </View>

          {/* الحالة */}
          <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.badgeText, { color: statusStyle.text }]}>
              {item.status || 'غير محدد'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>{item.appointmentDate || '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>{item.appointmentTime || '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="medkit-outline" size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>{item.serviceName || item.service || '—'}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i);
    // لو عدد الصفحات كتير، نعرض 5 بس حوالين الصفحة الحالية
    const start = Math.max(0, page - 2);
    const end = Math.min(totalPages, page + 3);
    const visiblePages = pages.slice(start, end);

    return (
      <View style={styles.pagination}>
        {/* Previous */}
        <TouchableOpacity
          style={[styles.pageBtn, page === 0 && styles.pageBtnDisabled]}
          onPress={() => goToPage(page - 1)}
          disabled={page === 0}
        >
          <Ionicons name="chevron-forward" size={18} color={page === 0 ? colors.textMuted : colors.text} />
        </TouchableOpacity>

        {/* Page numbers */}
        {visiblePages.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.pageBtn, p === page && styles.pageBtnActive]}
            onPress={() => goToPage(p)}
          >
            <Text style={[styles.pageText, p === page && styles.pageTextActive]}>
              {p + 1}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Next */}
        <TouchableOpacity
          style={[styles.pageBtn, page === totalPages - 1 && styles.pageBtnDisabled]}
          onPress={() => goToPage(page + 1)}
          disabled={page === totalPages - 1}
        >
          <Ionicons name="chevron-back" size={18} color={page === totalPages - 1 ? colors.textMuted : colors.text} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {/* الهيدر */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-forward" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>كل المواعيد</Text>
        <Ionicons name='refresh' size={24} color={colors.navIcon} onPress={()=>goToPage(0)} />
      </View>

      {/* القائمة */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="calendar-clear-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>لا توجد مواعيد حالياً.</Text>
            </View>
          }
          ListFooterComponent={renderPagination}
        />
      )}
    </View>
  );
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
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
    headerTitle: { fontSize: 18 * fontScale, fontWeight: '900', color: colors.text },

    // القائمة
    listContent: { padding: spacing.md, paddingBottom: 100 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
    emptyText: { color: colors.textMuted, fontSize: 14 * fontScale, marginTop: spacing.sm },

    // كارت الموعد
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      marginBottom: spacing.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow.card,
    },
    row: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    patientInfo: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: spacing.sm,
    },
    avatarMini: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: { color: colors.primary, fontWeight: '900', fontSize: 16 * fontScale },
    patientName: { fontSize: 15 * fontScale, fontWeight: '900', color: colors.text, textAlign: 'right' },
    patientPhone: { fontSize: 12 * fontScale, color: colors.textMuted, textAlign: 'right' },

    badge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.pill,
    },
    badgeText: { fontSize: 11 * fontScale, fontWeight: '900' },

    divider: {
      height: 1,
      backgroundColor: colors.divider,
      marginVertical: spacing.sm,
    },

    infoRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 4,
    },
    infoText: { fontSize: 12 * fontScale, color: colors.textSecondary, fontWeight: '700' },

    // الترقيم
    pagination: {
      flexDirection: 'row-reverse',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.md,
      gap: spacing.sm,
    },
    pageBtn: {
      minWidth: 36,
      height: 36,
      borderRadius: radius.md,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pageBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    pageBtnDisabled: { opacity: 0.4 },
    pageText: { fontSize: 13 * fontScale, fontWeight: '700', color: colors.text },
    pageTextActive: { color: colors.onPrimary },
  });
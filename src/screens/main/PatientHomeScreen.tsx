import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, radius, shadow } from '../../theme';
import { User } from '../../../types/user';
import useUser from '../../hooks/useUser';
import SmallIndicator from '../../components/SmallIndicator';

export default function PatientHomeScreen({ navigation }: any) {
  const { email, fullName } = useAuth();
  const { data: user, loading } = useUser();
  return (
    <>
      <View style={styles.welcomeHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={colors.gold} />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={styles.welcomeTitle}>
            أهلاً بك، {fullName || email?.split('@')[0]}
          </Text>
          <Text style={styles.welcomeSub}>مريض ذهبي</Text>
        </View>
      </View>

      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
        {/* 2. المعلومات الشخصية */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>المعلومات الشخصية</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditPersonalDetails')}
            >
              <Ionicons name="pencil" size={20} color={colors.gold} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>الاسم الكامل</Text>
              <Text style={styles.infoValue}>
                {loading ? <SmallIndicator /> : user?.fullName || 'غير محدد'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>البريد الإلكتروني</Text>
              <Text style={styles.infoValue}>
                {loading ? <SmallIndicator /> : email || 'غير محدد'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>رقم الجوال</Text>
              <Text style={styles.infoValue}>
                {loading ? <SmallIndicator /> : user?.phoneNumber || 'غير محدد'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>تاريخ الميلاد</Text>
              <Text style={styles.infoValue}>
                {loading ? <SmallIndicator /> : user?.dateOfBirth || 'غير محدد'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>الجنس</Text>
              <Text style={styles.infoValue}>
                {loading ? <SmallIndicator /> : user?.gender || 'غير محدد'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>العنوان</Text>
              <Text style={styles.infoValue}>
                {loading ? <SmallIndicator /> : user?.address || 'غير محدد'}
              </Text>
            </View>
          </View>
        </View>

        {/* 3. المواعيد */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>مواعيدي القادمة والسابقة</Text>
            <TouchableOpacity>
              <Ionicons name="eye" size={20} color={colors.gold} />
            </TouchableOpacity>
          </View>
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>لا توجد مواعيد مجدولة حالياً.</Text>
          </View>
        </View>

        {/* 4. الملف الطبي */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>الملف الطبي</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditMedicalRecord')}
            >
              <Ionicons name="pencil" size={20} color={colors.gold} />
            </TouchableOpacity>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.rowBetween}>
              <Text style={styles.infoLabel}>فصيلة الدم</Text>
              {/* <View style={styles.badgeGreen}><Text style={styles.badgeGreenText}>{user?.bloodType || 'غير معروفة'}</Text></View> */}
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.infoLabel}>الحساسية</Text>
              <Text style={styles.infoValue}>لا توجد</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.infoLabel}>الأمراض المزمنة</Text>
              <Text style={styles.infoValue}>لا توجد</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.infoLabel}>الأدوية الحالية</Text>
              <Text style={styles.infoValue}>لا توجد</Text>
            </View>
          </View>
        </View>

        {/* 5. اتصال الطوارئ */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>اتصال الطوارئ</Text>
            <TouchableOpacity>
              <Ionicons name="pencil" size={20} color={colors.gold} />
            </TouchableOpacity>
          </View>
          <View style={styles.cardBody}>
            {/* <View style={styles.rowBetween}><Text style={styles.infoLabel}>الاسم</Text><Text style={styles.infoValue}>{user?.emergencyContactName || 'غير محدد'}</Text></View> */}
            {/* <View style={styles.rowBetween}><Text style={styles.infoLabel}>رقم الجوال</Text><Text style={styles.infoValue}>{user?.emergencyContactPhone || 'غير محدد'}</Text></View> */}
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                سيتم التواصل مع هذا الرقم فوراً في الحالات الحرجة فقط
              </Text>
            </View>
          </View>
        </View>

        {/* 6. الأمان */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>تغيير كلمة المرور</Text>
          </View>
          <View style={styles.cardBody}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="lock-closed" size={20} color={colors.gold} />
              <Text style={styles.actionText}>تحديث كلمة المرور</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgLight, padding: spacing.md },

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
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.gold,
  },
  welcomeTitle: { fontSize: 20, fontWeight: '900', color: colors.white },
  welcomeSub: { fontSize: 14, color: colors.gold, fontWeight: '700' },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    ...shadow.card,
    overflow: 'hidden',
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

  infoGrid: {
    padding: spacing.md,
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: { width: '48%', marginBottom: spacing.md },
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

  rowBetween: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 8,
  },
  badgeGreen: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeGreenText: { color: '#0a7c2b', fontWeight: '700', fontSize: 12 },

  warningBox: {
    backgroundColor: colors.goldLight,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    marginTop: spacing.sm,
  },
  warningText: {
    fontSize: 12,
    color: colors.primary,
    textAlign: 'right',
    fontWeight: '700',
  },

  emptyBox: { padding: spacing.lg, alignItems: 'center' },
  emptyText: { color: colors.textMuted, fontSize: 14 },

  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgGray,
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  actionText: { color: colors.primary, fontWeight: '700', fontSize: 16 },
});

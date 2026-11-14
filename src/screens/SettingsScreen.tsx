import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  I18nManager,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ModeContext';
import { useAuth } from '../context/AuthContext';
import { lightMode, radius, spacing } from '../theme';
import NavBar from '../components/layout/NavBar';

export default function SettingsScreen({ navigation }: any) {
  const { colors, isDark, toggleMode } = useTheme();
  const { signOut } = useAuth();
  const { fontSize, setFontSize, fontScale, language, setLanguage, t } =
    useTheme();
  const styles = useMemo(
    () => getStyles(colors, fontScale),
    [colors, fontScale],
  );

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);
  
 const handleLanguageToggle = () => {
    Alert.alert(
      t('language'),
      t('choose_language'),
      [
        { text: t('arabic'), onPress: () => setLanguage('ar') },
        { text: t('english'), onPress: () => setLanguage('en') },
        { text: t('cancel'), style: 'cancel' },
      ],
      { cancelable: true }
    );
  };
  const handleFontSize = () => {
    Alert.alert('حجم الخط', 'اختر حجم الخط المناسب لك', [
      { text: 'صغير', onPress: () => setFontSize('small') },
      { text: 'متوسط', onPress: () => setFontSize('medium') },
      { text: 'كبير', onPress: () => setFontSize('large') },
      { text: 'إلغاء', style: 'cancel' },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'حذف الحساب',
      'هل أنت متأكد من حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () =>
            Alert.alert('تم', 'سيتم ربط هذا الإجراء بالـ API قريباً.'),
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <NavBar navigation={navigation} title={t("settings")} />

      {/* 2. المظهر (Dark Mode) */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="color-palette-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.sectionTitle}>{t("appearance")}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="moon-outline"
              size={22}
              color={colors.textSecondary}
            />
            <View>
              <Text style={styles.rowTitle}>{t('dark_mode')}</Text>
              <Text style={styles.rowSub}>{t('dark_mode_desc')}</Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleMode}
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={colors.card}
            style={{ transform: [{ scaleX: I18nManager.isRTL ? 1 : -1 }] }}
          />
        </View>
      </View>

      {/* 3. الإشعارات */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="notifications-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.sectionTitle}>{t('notifications')}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="notifications"
              size={22}
              color={colors.textSecondary}
            />
            <View>
              <Text style={styles.rowTitle}> {t('enable_notifications')}</Text>
              <Text style={styles.rowSub}>استقبال إشعارات عامة</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={colors.card}
            style={{ transform: [{ scaleX: I18nManager.isRTL ? 1 : -1 }] }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="mail-outline"
              size={22}
              color={colors.textSecondary}
            />
            <View>
              <Text style={styles.rowTitle}>تنبيهات البريد الإلكتروني</Text>
              <Text style={styles.rowSub}>تقارير وفواتير</Text>
            </View>
          </View>
          <Switch
            value={emailAlerts}
            onValueChange={setEmailAlerts}
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={colors.card}
            style={{ transform: [{ scaleX: I18nManager.isRTL ? 1 : -1 }] }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color={colors.textSecondary}
            />
            <View>
              <Text style={styles.rowTitle}>الرسائل النصية SMS</Text>
              <Text style={styles.rowSub}>تنبيهات المواعيد</Text>
            </View>
          </View>
          <Switch
            value={smsAlerts}
            onValueChange={setSmsAlerts}
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={colors.card}
            style={{ transform: [{ scaleX: I18nManager.isRTL ? 1 : -1 }] }}
          />
        </View>
      </View>

      {/* 4. اللغة والخط */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="language-outline" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>{t('language_and_font')}</Text>
        </View>

        <TouchableOpacity style={styles.row} onPress={handleLanguageToggle}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="globe-outline"
              size={22}
              color={colors.textSecondary}
            />
            <View>
              <Text style={styles.rowTitle}>اللغة</Text>
              <Text style={styles.rowSub}>{language}</Text>
            </View>
          </View>
          <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row} onPress={handleFontSize}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="text-outline"
              size={22}
              color={colors.textSecondary}
            />
            <View>
              <Text style={styles.rowTitle}>حجم الخط</Text>
              <Text style={styles.rowSub}>
                {fontSize === 'small'
                  ? 'صغير'
                  : fontSize === 'medium'
                  ? 'متوسط'
                  : 'كبير'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* 5. الدعم والمساعدة */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="help-circle-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.sectionTitle}>الدعم والمساعدة</Text>
        </View>

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color={colors.textSecondary}
            />
            <Text style={styles.rowTitle}>سياسة الخصوصية</Text>
          </View>
          <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="document-text-outline"
              size={22}
              color={colors.textSecondary}
            />
            <Text style={styles.rowTitle}>الشروط والأحكام</Text>
          </View>
          <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={colors.textSecondary}
            />
            <Text style={styles.rowTitle}>عن التطبيق</Text>
          </View>
          <Text style={styles.versionText}>v1.0.0</Text>
        </TouchableOpacity>
      </View>

      {/* 6. إجراءات الحساب */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.row} onPress={signOut}>
          <View style={styles.rowLeft}>
            <Ionicons name="log-out-outline" size={22} color={colors.warning} />
            <Text style={[styles.rowTitle, { color: colors.warning }]}>
              تسجيل الخروج
            </Text>
          </View>
          <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row} onPress={handleDeleteAccount}>
          <View style={styles.rowLeft}>
            <Ionicons name="trash-outline" size={22} color={colors.error} />
            <Text style={[styles.rowTitle, { color: colors.error }]}>
              حذف الحساب
            </Text>
          </View>
          <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        © 2026 عيادة الشفاء - جميع الحقوق محفوظة
      </Text>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const getStyles = (colors: typeof lightMode, fontScale: number) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },

    // الهيدر
    header: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20 * fontScale,
      fontWeight: '900',
      color: colors.text,
    },

    // الكروت
    card: {
      backgroundColor: colors.card,
      marginHorizontal: spacing.md,
      marginTop: spacing.md,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionHeader: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    sectionTitle: {
      fontSize: 15 * fontScale,
      fontWeight: '900',
      color: colors.text,
    },

    // الصفوف
    row: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
    },
    rowLeft: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
    },
    rowTitle: {
      fontSize: 15 * fontScale,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'right',
    },
    rowSub: {
      fontSize: 12 * fontScale,
      color: colors.textMuted,
      textAlign: 'right',
      marginTop: 2,
    },

    // الفواصل
    divider: { height: 1, backgroundColor: colors.divider },

    // نصوص
    versionText: { fontSize: 13 * fontScale, color: colors.textMuted },
    footerText: {
      textAlign: 'center',
      color: colors.textMuted,
      fontSize: 12 * fontScale,
      marginTop: spacing.lg,
    },
  });

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ModeContext';
import { useAuth } from '../context/AuthContext';
import { lightMode, radius, spacing } from '../theme';
import NavBar from '../components/layout/NavBar';
import SelectionModal from '../components/SelectionModal';
import { createDirectionalStyles } from '../utils/direction';

export default function SettingsScreen({ navigation }: any) {
  const {
    colors,
    isDark,
    toggleMode,
    isRTL,
    fontSize,
    setFontSize,
    fontScale,
    language,
    setLanguage,
    t,
  } = useTheme();
  const { signOut } = useAuth();
  const styles = useMemo(
    () => createDirectionalStyles(getStyles(colors, fontScale), isRTL),
    [colors, fontScale, isRTL],
  );

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);

  // const handleLanguageToggle = () => {
  //   Alert.alert(
  //     t('language'),
  //     t('choose_language'),
  //     [
  //       { text: t('arabic'), onPress: () => setLanguage('ar') },
  //       { text: t('english'), onPress: () => setLanguage('en') },
  //       { text: t('cancel'), style: 'cancel' },
  //     ],
  //     { cancelable: true },
  //   );
  // };
  // const handleFontSize = () => {
  //   Alert.alert('حجم الخط', 'اختر حجم الخط المناسب لك', [
  //     { text: 'صغير', onPress: () => setFontSize('small') },
  //     { text: 'متوسط', onPress: () => setFontSize('medium') },
  //     { text: 'كبير', onPress: () => setFontSize('large') },
  //     { text: 'إلغاء', style: 'cancel' },
  //   ]);
  // };

  console.log("rtl",isRTL)
  const handleDeleteAccount = () => {
    Alert.alert(
      t('delete_account'),
      t('delete_account_confirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () =>
            Alert.alert(t('done'), t('api_coming_soon')),
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
          <SelectionModal
        visible={languageModalVisible}
        title={t('choose_language')}
        selectedValue={language}
        options={[
          { label: t('arabic'), value: 'ar' },
          { label: t('english'), value: 'en' },
        ]}
        onSelect={(v) => setLanguage(v as any)}
        onClose={() => setLanguageModalVisible(false)}
      />

      <SelectionModal
        visible={fontSizeModalVisible}
        title={t('choose_font_size')}
        selectedValue={fontSize}
        options={[
          { label: t('small'), value: 'SMALL' },
          { label: t('medium'), value: 'MEDIUM' },
          { label: t('large'), value: 'LARGE' },
        ]}
        onSelect={(v) => setFontSize(v as any)}
        onClose={() => setFontSizeModalVisible(false)}
      />
      <NavBar navigation={navigation} title={t('settings')} />

      {/* 2. المظهر (Dark Mode) */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="color-palette-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.sectionTitle}>{t('appearance')}</Text>
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
              <Text style={styles.rowSub}>{t('general_notifications')}</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={colors.card}
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
              <Text style={styles.rowTitle}>{t('email_notifications')}</Text>
              <Text style={styles.rowSub}>{t('reports_bills')}</Text>
            </View>
          </View>
          <Switch
            value={emailAlerts}
            onValueChange={setEmailAlerts}
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={colors.card}
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
              <Text style={styles.rowTitle}>{t('sms_notifications')}</Text>
              <Text style={styles.rowSub}>{t('sms_alerts')}</Text>
            </View>
          </View>
          <Switch
            value={smsAlerts}
            onValueChange={setSmsAlerts}
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={colors.card}
          />
        </View>
      </View>

      {/* 4. اللغة والخط */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="language-outline" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>{t('language_and_font')}</Text>
        </View>

        <TouchableOpacity style={styles.row} onPress={()=>setLanguageModalVisible(true)}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="globe-outline"
              size={22}
              color={colors.textSecondary}
            />
            <View>
              <Text style={styles.rowTitle}>{t('language')}</Text>
              <Text style={styles.rowSub}>{t(language === 'ar' ? 'arabic' : 'english')}</Text>
            </View>
          </View>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row} onPress={()=>setFontSizeModalVisible(true)}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="text-outline"
              size={22}
              color={colors.textSecondary}
            />
            <View>
              <Text style={styles.rowTitle}>{t('font_size')}</Text>
              <Text style={styles.rowSub}>
                {fontSize === 'SMALL'
                  ? t('small')
                  : fontSize === 'MEDIUM'
                  ? t('medium')
                  : t('large')}
              </Text>
            </View>
          </View>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={colors.textMuted} />
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
          <Text style={styles.sectionTitle}>{t('support')}</Text>
        </View>

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color={colors.textSecondary}
            />
            <Text style={styles.rowTitle}>{t('privacy_policy')}</Text>
          </View>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="document-text-outline"
              size={22}
              color={colors.textSecondary}
            />
            <Text style={styles.rowTitle}>{t('terms')}</Text>
          </View>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={colors.textSecondary}
            />
            <Text style={styles.rowTitle}>{t('about_app')}</Text>
          </View>
          <Text style={styles.versionText}>{t('version')} 1.0.0</Text>
        </TouchableOpacity>
      </View>

      {/* 6. إجراءات الحساب */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.row} onPress={signOut}>
          <View style={styles.rowLeft}>
            <Ionicons name="log-out-outline" size={22} color={colors.warning} />
            <Text style={[styles.rowTitle, { color: colors.warning }]}>
              {t('logout')}
            </Text>
          </View>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row} onPress={handleDeleteAccount}>
          <View style={styles.rowLeft}>
            <Ionicons name="trash-outline" size={22} color={colors.error} />
            <Text style={[styles.rowTitle, { color: colors.error }]}>
              {t('delete_account')}
            </Text>
          </View>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        {t('copyright')}
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
       
    },
    rowSub: {
      fontSize: 12 * fontScale,
      color: colors.textMuted,
       
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

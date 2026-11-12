import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ModeContext';
import { lightMode, radius, shadow, spacing } from '../theme';

export default function AppHeader({
  title = 'عيادة الشفاء',
}: {
  title?: string;
}) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { fullName, email, photoUrl, signOut } = useAuth();
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const styles = useMemo(() => getStyles(colors), [colors]);

  const userInitial = (fullName || email || 'U').trim().charAt(0).toUpperCase();
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={styles.menuBtn}
        >
          <Ionicons
            name={`caret-${menuVisible ? 'up' : 'down'}-outline`}
            size={18}
            color={colors.primary}
          />
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitial}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          style={[
            styles.statusBtn,
            isAvailable ? styles.statusActive : styles.statusInactive,
          ]}
          onPress={() => setIsAvailable(!isAvailable)}
        >
          <View
            style={[
              styles.statusDot,
              isAvailable ? styles.dotGreen : styles.dotRed,
            ]}
          />
          <Text style={styles.statusText}>
            {isAvailable ? 'متاح' : 'إجازة'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.logoCircle}>
          <Ionicons name="medkit" size={22} color={colors.navIcon} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate('Settings');
                }}
              >
                <Ionicons name="cog" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}> الاعدادات</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate('Profile');
                }}
              >
                <Ionicons
                  name="person-circle"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.menuItemText}>الملف الشخصي</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  signOut();
                }}
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={colors.error}
                />
                <Text style={[styles.menuItemText, { color: colors.error }]}>
                  تسجيل الخروج
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
const getStyles = (colors: typeof lightMode) =>
  StyleSheet.create({
    headerContainer: {
      height: 85,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      backgroundColor: colors.navBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.tabBarBorder,
    },

    statusBtn: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.pill,
      gap: 4,
      marginRight: 'auto',
    },
    statusActive: { backgroundColor: colors.success + '40' },
    statusInactive: { backgroundColor: colors.error + '40' },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    dotGreen: { backgroundColor: colors.success },
    dotRed: { backgroundColor: colors.error },
    statusText: { fontSize: 12, fontWeight: '700', color: colors.navText },

    rightSection: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: spacing.md,
    },
    logoCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    // صورة المستخدم (الدائرة الذهبية)
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.navIcon,
    },
    avatarText: {
      color: colors.primary,
      fontWeight: '900',
      fontSize: 18,
    },

    // زرار القائمة
    menuBtn: {
      padding: spacing.xs,
      display: 'flex',
      flexDirection: 'row-reverse',
      alignItems: 'center',
    },

    title: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.navText,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingTop: 70,
      paddingLeft: 16,
    },
    dropdown: {
      width: 200,
      backgroundColor: colors.modal,
      borderRadius: radius.md,
      paddingVertical: spacing.sm,
      ...shadow.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    menuItem: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
    },
    menuItemText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: colors.divider,
      marginVertical: spacing.xs,
    },
  });

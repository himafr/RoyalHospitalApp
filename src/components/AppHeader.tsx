import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, radius, shadow } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function AppHeader({
  title = 'عيادة الشفاء',
}: {
  title?: string;
}) {
  const insets = useSafeAreaInsets();
  const { fullName, email, photoUrl, signOut } = useAuth();
  const navigation =useNavigation()
  const [menuVisible, setMenuVisible] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const userInitial = (fullName || email || 'U').charAt(0).toUpperCase();
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
          <View style={styles.avatar}>
            {photoUrl ? (
              <Text style={styles.avatarText}>{userInitial}</Text>
            ) : (
              <Ionicons name="person" size={22} color={colors.gold} />
            )}
          </View>
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
          <Ionicons name="medkit" size={22} color={colors.gold} />
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
                  navigation.navigate('Profile')
                }}
              >
                <Ionicons name="person-circle" size={24} color={colors.primary} />
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
                  color={colors.danger}
                />
                <Text style={[styles.menuItemText, { color: colors.danger }]}>
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

const styles = StyleSheet.create({
  headerContainer: {
    height: 85,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.dark+70,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorder,
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
  statusActive: { backgroundColor: colors.success + '20' },
  statusInactive: { backgroundColor: colors.danger + '20' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  dotGreen: { backgroundColor: colors.success },
  dotRed: { backgroundColor: colors.danger },
  statusText: { fontSize: 12, fontWeight: '700', color: colors.primary },

  rightSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark+30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // صورة المستخدم (الدائرة الذهبية)
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  avatarText: {
    color: colors.gold,
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
    color: colors.primary,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', 
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 70, 
    paddingLeft: 16, 
  },
  dropdown: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    ...shadow.card, 
    borderWidth: 1,
    borderColor: colors.borderLight,
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
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.xs,
  },
});

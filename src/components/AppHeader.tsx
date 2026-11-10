import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, radius, shadow } from '../theme';

export default function AppHeader({ title = 'عيادة الشفاء' }: { title?: string }) {
  const { fullName,email,photoUrl, signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const userInitial = (fullName || email || 'U').charAt(0).toUpperCase();

  return (
    <View style={styles.headerContainer}>
      
      <View style={styles.rightSection}>
        <View style={styles.avatar}>
          {photoUrl ? (
            <Text style={styles.avatarText}>{userInitial}</Text> 
          ) : (
            <Ionicons name="person" size={22} color={colors.gold} />
          )}
        </View>

        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuBtn}>
          <Ionicons name="menu" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{title}</Text>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdown}>
              
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); /* كودك هنا */ }}>
                <Ionicons name="apps" size={20} color={colors.primary} />
                <Text style={styles.menuItemText}>عنصر تجريبي</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => {
                  setMenuVisible(false);
                  signOut();
                }}
              >
                <Ionicons name="log-out-outline" size={20} color={colors.danger} />
                <Text style={[styles.menuItemText, { color: colors.danger }]}>تسجيل الخروج</Text>
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
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorder,
    // ✨ لو التطبيق بيستخدم SafeArea
    // paddingTop: insets.top, 
  },
  
  // الجزء الشمال (الصورة والقائمة)
  rightSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.md,
  },
  
  // صورة المستخدم (الدائرة الذهبية)
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.goldLight,
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
  },
  
  // العنوان (عيادة الشفاء)
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
  },

  // ✨ تصميم القائمة المنسدلة
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // خلفية شفافة عشان تبرز القائمة
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 70, // مسافة من فوق عشان تظهر تحت الهيدر
    paddingLeft: 16, // مسافة من الشمال
  },
  dropdown: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    ...shadow.card, // بنستخدم الظل بتاع التصميم بتاعنا
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
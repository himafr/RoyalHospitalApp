import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, radius } from '../../theme';

export default function HomeScreen() {
  const { fullName, signOut } = useAuth();

  return (
    <ScrollView >
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Icon name="medkit" size={22} color={colors.gold} />
        </View>
        <Text style={styles.brand}>عيادة الشفاء</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          رعاية طبية{'\n'}
          <Text style={{ color: colors.gold }}>باحترافية وثقة</Text>
        </Text>
        <Text style={styles.heroSub}>
          نقدم أفضل الخدمات الطبية بأحدث التقنيات لضمان صحتكم وسلامتكم.
        </Text>
      </View>

      <View style={{ padding: spacing.lg }}>
        <Text
          style={{
            color: colors.primary,
            fontSize: 18,
            fontWeight: '700',
            marginBottom: spacing.md,
            textAlign: 'right',
          }}
        >
          أهلاً بك، { fullName || 'مستخدم'} 👋
        </Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
           <Icon name="log-out" size={20} color={colors.white} /> 
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity> 
       </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: {
    height: 65,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorder,
    gap: spacing.sm,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: { fontSize: 18, fontWeight: '900', color: colors.primary },
  hero: {
    padding: spacing.lg,
    backgroundColor: colors.bgLight,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
    lineHeight: 42,
    textAlign: 'right',
  },
  heroSub: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginTop: spacing.md,
    textAlign: 'right',
  },
  logoutBtn: {
    backgroundColor: colors.danger,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  logoutText: { color: colors.white, fontWeight: '700', fontSize: 16 },
});

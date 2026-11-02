import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, radius } from '../../theme';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('hema@sallem.com');
  const [password, setPassword] = useState('12345678');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password)
      return setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      setError(
        e.response?.data?.message ||
          e.message ||
          'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.logoHolder}>
            <Icon name="medkit" size={40} color={colors.gold} />
          </View>
          <Text style={styles.brand}>العيادة</Text>
          <Text style={styles.tagline}>الفخامة في الرعاية</Text>
          <View style={styles.divider} />
          <Text style={styles.title}>تسجيل الدخول</Text>

          <View style={{ width: '100%', marginTop: spacing.lg }}>
            <InputField
              label="البريد الإلكتروني"
              value={email}
              onChangeText={setEmail}
              placeholder="hema@example.com"
              keyboardType="email-address"
              icon="at"
            />
            <InputField
              label="كلمة المرور"
              value={password}
              onChangeText={setPassword}
              placeholder="أدخل كلمة المرور"
              secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <PrimaryButton
              title="تسجيل الدخول"
              onPress={handleLogin}
              loading={loading}
              icon="arrow-back"
            />

            <View style={styles.signupBox}>
              <Text style={styles.signupText}>ليس لديك حساب؟ </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}>إنشاء حساب جديد</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('DoctorSignup')}
              style={{ marginTop: spacing.sm, alignSelf: 'center' }}
            >
              <Text style={[styles.signupLink, { fontSize: 14 }]}>
                تسجيل كطبيب
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  card: {
    backgroundColor: colors.bgLight,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gold,
    padding: spacing.lg,
    alignItems: 'center',
  },
  logoHolder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    fontSize: 30,
    fontWeight: '500',
    color: colors.primary,
    marginTop: spacing.sm,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  },
  divider: {
    width: 48,
    height: 2,
    backgroundColor: colors.gold,
    marginVertical: spacing.md,
  },
  title: { fontSize: 20, fontWeight: '500', color: colors.primary },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  signupBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 2,
    borderTopColor: colors.goldBorder,
    flexWrap: 'wrap',
  },
  signupText: { fontSize: 14, color: colors.textMuted },
  signupLink: { fontSize: 16, color: colors.primary, fontWeight: '700' },
});

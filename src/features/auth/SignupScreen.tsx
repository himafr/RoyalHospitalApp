import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import SmoothScrollView from '../../components/SmoothScrollView';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ModeContext';
import { lightMode, radius, spacing } from '../../theme';
import { getErrorMessage, showErrorToast, showSuccessToast } from '../../utils/toast';

export default function SignupScreen({ navigation }: any) {
  const { colors } = useTheme();
const styles = useMemo(() => getStyles(colors), [colors]);
  const { signup } = useAuth();
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', email: '', password: '', passwordCheck: '', gender: 'ذكر', agree: true });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSignup = async () => {
    setError('');
    if (!form.fullName || !form.email || !form.password) return setError('يرجى ملء الحقول المطلوبة');
    if (form.password !== form.passwordCheck) return setError('كلمتا المرور غير متطابقتين');
    if (!form.agree) return setError('يجب الموافقة على الشروط');
    setLoading(true);
    try {
      await signup(form);
      showSuccessToast('تم إنشاء حسابك. أرسلنا إليك كود التفعيل.');
      navigation.navigate('Activate', { email: form.email });
    } catch (e: unknown) {
      showErrorToast(getErrorMessage(e, 'حدث خطأ أثناء إنشاء الحساب'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <SmoothScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.header}>إنشاء حساب جديد</Text>
          <Text style={styles.sub}>انضم إلى نخبة مرضانا واستمتع بخدماتنا المتميزة</Text>

          <View style={{ width: '100%', marginTop: spacing.lg }}>
            <InputField label="الاسم بالكامل" value={form.fullName} onChangeText={(v) => update('fullName', v)} placeholder="ادخل اسمك الثلاثي" icon="person" />
            <InputField label="رقم الهاتف" value={form.phoneNumber} onChangeText={(v) => update('phoneNumber', v)} placeholder="011*********" keyboardType="phone-pad" icon="call" />
            <InputField label="البريد الإلكتروني" value={form.email} onChangeText={(v) => update('email', v)} placeholder="hema@example.com" keyboardType="email-address" icon="at" />
            <InputField label="كلمة المرور" value={form.password} onChangeText={(v) => update('password', v)} placeholder="أدخل كلمة المرور" secureTextEntry />
            <InputField label="تأكيد كلمة المرور" value={form.passwordCheck} onChangeText={(v) => update('passwordCheck', v)} placeholder="تأكيد كلمة المرور" secureTextEntry />

            <Text style={styles.label}>الجنس</Text>
            <View style={styles.genderRow}>
              {['ذكر', 'أنثى'].map((g) => (
                <TouchableOpacity key={g} onPress={() => update('gender', g)} style={[styles.genderBtn, form.gender === g && styles.genderActive]}>
                  <Text style={[styles.genderText, form.gender === g && styles.genderTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.checkRow} onPress={() => update('agree', !form.agree)}>
              <View style={[styles.checkbox, form.agree && styles.checkboxActive]}>
                {form.agree && <Icon name="checkmark" size={14} color={colors.primary} />}
              </View>
              <Text style={styles.checkText}>أوافق على الشروط والأحكام وسياسة الخصوصية</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <PrimaryButton title="إنشاء الحساب" onPress={handleSignup} loading={loading} icon="arrow-back" />

            <View style={styles.loginBox}>
              <Text style={styles.loginText}>لديك حساب بالفعل؟ </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>سجل دخولك الآن</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SmoothScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors: typeof lightMode) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
    card: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.iconActive, padding: spacing.lg },
    header: { fontSize: 28, color: colors.text, textAlign: 'right' },
    sub: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'right' },
    label: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.xs, textTransform: 'uppercase', textAlign: 'right' },
    genderRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
    genderBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, alignItems: 'center' },
    genderActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    genderText: { color: colors.text, fontWeight: '700' },
    genderTextActive: { color: colors.onPrimary },
    checkRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: spacing.md },
    checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: colors.iconActive, justifyContent: 'center', alignItems: 'center', marginLeft: spacing.sm },
    checkboxActive: { backgroundColor: colors.iconActive },
    checkText: { fontSize: 13, color: colors.textMuted, flex: 1, textAlign: 'right' },
    error: { color: colors.error, fontSize: 13, marginBottom: spacing.sm, textAlign: 'center' },
    loginBox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.md, flexWrap: 'wrap' },
    loginText: { fontSize: 14, color: colors.textMuted },
    loginLink: { fontSize: 16, color: colors.link, fontWeight: '700' },
  });
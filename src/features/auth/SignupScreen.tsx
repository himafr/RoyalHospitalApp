import { createDirectionalStyles } from '../../utils/direction';
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
  const { colors,fontScale,t, isRTL} = useTheme();
const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);
  const { signup } = useAuth();
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', email: '', password: '', passwordCheck: '', gender: 'ذكر', agree: true });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSignup = async () => {
    setError('');
    if (!form.fullName || !form.email || !form.password) return setError(t('fill_all_fields'));
    if (form.password !== form.passwordCheck) return setError(t('password_mismatch'));
    if (!form.agree) return setError(t('signup_terms_required'));
    setLoading(true);
    try {
      await signup(form);
      showSuccessToast(t('signup_success_notice'), t('success'));
      navigation.navigate('Activate', { email: form.email });
    } catch (e: unknown) {
      showErrorToast(getErrorMessage(e, t('err_generic')), t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <SmoothScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.header}>{t('signup_title')}</Text>
          <Text style={styles.sub}>{t('signup_subtitle')}</Text>

          <View style={{ width: '100%', marginTop: spacing.lg }}>
            <InputField label={t('full_name')} value={form.fullName} onChangeText={(v) => update('fullName', v)} placeholder={t('full_name_placeholder')} icon="person" />
            <InputField label={t('phone_number')} value={form.phoneNumber} onChangeText={(v) => update('phoneNumber', v)} placeholder={t('phone_placeholder')} keyboardType="phone-pad" icon="call" />
            <InputField label={t('email_label')} value={form.email} onChangeText={(v) => update('email', v)} placeholder={t('email_placeholder')} keyboardType="email-address" icon="at" />
            <InputField label={t('password')} value={form.password} onChangeText={(v) => update('password', v)} placeholder={t('password_placeholder')} secureTextEntry />
            <InputField label={t('confirm_password')} value={form.passwordCheck} onChangeText={(v) => update('passwordCheck', v)} placeholder={t('confirm_password_placeholder')} secureTextEntry />

            <Text style={styles.label}>{t('gender')}</Text>
            <View style={styles.genderRow}>
              {[
                { label: t('gender_male'), value: 'ذكر' },
                { label: t('gender_female'), value: 'أنثى' },
              ].map(({ label, value }) => (
                <TouchableOpacity key={value} onPress={() => update('gender', value)} style={[styles.genderBtn, form.gender === value && styles.genderActive]}>
                  <Text style={[styles.genderText, form.gender === value && styles.genderTextActive]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.checkRow} onPress={() => update('agree', !form.agree)}>
              <View style={[styles.checkbox, form.agree && styles.checkboxActive]}>
                {form.agree && <Icon name="checkmark" size={14} color={colors.primary} />}
              </View>
              <Text style={styles.checkText}>{t('terms_agree')}</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <PrimaryButton title={t('signup')} onPress={handleSignup} loading={loading} icon="arrow-back" />

            <View style={styles.loginBox}>
              <Text style={styles.loginText}>{t('have_account')} </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>{t('login_now')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SmoothScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
    card: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.iconActive, padding: spacing.lg },
    header: { fontSize: 28 * fontScale, color: colors.text, textAlign: 'right' },
    sub: { fontSize: 14 * fontScale, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'right' },
    label: { fontSize: 12 * fontScale, color: colors.textMuted, marginBottom: spacing.xs, textTransform: 'uppercase', textAlign: 'right' },
    genderRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
    genderBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, alignItems: 'center' },
    genderActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    genderText: { color: colors.text, fontWeight: '700' },
    genderTextActive: { color: colors.onPrimary },
    checkRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: spacing.md },
    checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: colors.iconActive, justifyContent: 'center', alignItems: 'center', marginLeft: spacing.sm },
    checkboxActive: { backgroundColor: colors.iconActive },
    checkText: { fontSize: 13 * fontScale, color: colors.textMuted, flex: 1, textAlign: 'right' },
    error: { color: colors.error, fontSize: 13 * fontScale, marginBottom: spacing.sm, textAlign: 'center' },
    loginBox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.md, flexWrap: 'wrap' },
    loginText: { fontSize: 14 * fontScale, color: colors.textMuted },
    loginLink: { fontSize: 16 * fontScale, color: colors.link, fontWeight: '700' },
  });
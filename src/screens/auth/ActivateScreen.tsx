import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import * as authApi from '../../api/auth';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, radius } from '../../theme';

const COUNTDOWN = 90;

export default function ActivateScreen({ route, navigation }: any) {
  const email = route.params?.email;
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  const startCountdown = () => {
    setSecondsLeft(COUNTDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => { if (s <= 1) { clearInterval(timerRef.current); return 0; } return s - 1; });
    }, 1000);
  };

  const handleSend = async () => {
    setError(''); setMessage('');
    try {
      await authApi.sendActivationCode(email);
      setMessage('تم إرسال كود التفعيل إلى بريدك');
      startCountdown();
    } catch (e: any) {
      setError(e.response?.data?.message || 'تعذر إرسال الكود');
    }
  };

  const handleVerify = async () => {
    setError(''); setMessage('');
    if (pin.length !== 6) return setError('أدخل كود من 6 أرقام');
    setLoading(true);
    try {
      await authApi.verifyActivationCode(email, pin);
      setMessage('تم تفعيل الحساب بنجاح');
      setTimeout(() => navigation.navigate('Login'), 1200);
    } catch (e: any) {
      setError(e.response?.data?.message || 'الكود غير صحيح');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>تفعيل الحساب</Text>
          <Text style={styles.sub}>سيتم إرسال كود التفعيل إلى بريدك الإلكتروني{email ? `\n${email}` : ''}</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {message ? <Text style={styles.success}>{message}</Text> : null}

          <TouchableOpacity onPress={handleSend} disabled={secondsLeft > 0} style={[styles.outlineBtn, secondsLeft > 0 && styles.disabled]}>
            <Text style={styles.outlineText}>{secondsLeft > 0 ? `إعادة الإرسال بعد ${secondsLeft} ثانية` : 'إرسال كود التفعيل'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>أدخل كود التفعيل</Text>
          <TextInput style={styles.pinInput} value={pin} onChangeText={(v) => setPin(v.replace(/\D/g, '').slice(0, 6))} placeholder="XXXXXX" placeholderTextColor={colors.textMuted} keyboardType="number-pad" maxLength={6} textAlign="center" />

          <PrimaryButton title="تفعيل الحساب" onPress={handleVerify} loading={loading} />

          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: spacing.md, alignSelf: 'center' }}>
            <Text style={styles.link}>رجوع</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.gold, padding: spacing.lg },
  title: { fontSize: 22, fontWeight: '700', color: colors.primary, textAlign: 'center' },
  sub: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.md },
  error: { color: colors.danger, fontSize: 13, textAlign: 'center', marginVertical: spacing.sm },
  success: { color: colors.success, fontSize: 13, textAlign: 'center', marginVertical: spacing.sm },
  outlineBtn: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: 'center', marginBottom: spacing.md },
  disabled: { opacity: 0.5 },
  outlineText: { color: colors.primary, fontWeight: '700' },
  label: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.xs, textAlign: 'right', textTransform: 'uppercase' },
  pinInput: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, height: 52, fontSize: 22, letterSpacing: 12, color: colors.primary, marginBottom: spacing.md, backgroundColor: colors.bgGray },
  link: { color: colors.primary, fontWeight: '700' },
});
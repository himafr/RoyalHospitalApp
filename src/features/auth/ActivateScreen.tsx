import { createDirectionalStyles } from '../../utils/direction';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as authApi from '../../api/auth';
import PrimaryButton from '../../components/PrimaryButton';
import SmoothScrollView from '../../components/SmoothScrollView';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ModeContext';
import { lightMode, radius, spacing } from '../../theme';

const COUNTDOWN = 90;

export default function ActivateScreen({ navigation }: any) {
  const { colors,fontScale,t, isRTL} = useTheme();
const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);
  const { updateToken } = useAuth(); 
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  const startCountdown = () => {
    setSecondsLeft(COUNTDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const handleSend = async () => {
    setError('');
    setMessage('');
    try {
      setLoading(true);
      await authApi.sendActivationCode();
      setMessage(t('activation_code_sent'));
      startCountdown();
    } catch (e: any) {
      setError(e.response?.message || t('activation_send_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = useCallback(async () => {
    setError('');
    setMessage('');
    if (pin.length !== 6) return setError(t('activation_code_length_error'));

    setLoading(true);
    try {
      const res = await authApi.verifyActivationCode(pin);

      const newToken = res.data;
      console.log(res);
      if (!newToken) throw new Error(t('activation_token_error'));

      await updateToken(newToken);

      setMessage(t('account_verified'));

      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (e: any) {
      setError(e.response?.data?.message || t('invalid_code'));
    } finally {
      setLoading(false);
    }
  }, [navigation, pin, t, updateToken]);

  useEffect(() => {
    if (pin.length === 6) {
      handleVerify();
    }
  }, [handleVerify, pin]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <SmoothScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.iconHeader}>
            <Ionicons name="shield-checkmark" size={48} color={colors.primary} />
          </View>

          <Text style={styles.title}>{t('activate_account')}</Text>
          <Text style={styles.sub}>
            {t('activation_code_hint')}
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {message ? <Text style={styles.success}>{message}</Text> : null}

          <TouchableOpacity
            onPress={handleSend}
            disabled={secondsLeft > 0 || loading}
            style={[styles.outlineBtn, secondsLeft > 0 && styles.disabled]}
          >
            <Text style={styles.outlineText}>
              {secondsLeft > 0
                ? `${t('resend_in')} ${secondsLeft} ${t('seconds')}`
                : t('resend_code')}
            </Text>
          </TouchableOpacity>

          {/* حقل إدخال الكود */}
          <Text style={styles.label}>{t('enter_code')}</Text>
          <TextInput
            style={styles.pinInput}
            value={pin}
            onChangeText={v => setPin(v.replace(/\D/g, '').slice(0, 6))}
            placeholder="XXXXXX"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
          />

          {/* زرار التأكيد */}
          <PrimaryButton
            title={t('confirm_activate')}
            onPress={handleVerify}
            loading={loading}
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>{t('back')}</Text>
          </TouchableOpacity>
        </View>
      </SmoothScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.xl,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 10,
    },
    iconHeader: {
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    title: {
      fontSize: 24 * fontScale,
      fontWeight: '900',
      color: colors.text,
      textAlign: 'center',
    },
    sub: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
      lineHeight: 22,
    },

    error: {
      color: colors.error,
      fontSize: 14 * fontScale,
      textAlign: 'center',
      marginBottom: spacing.md,
      fontWeight: '700',
    },
    success: {
      color: colors.success,
      fontSize: 14 * fontScale,
      textAlign: 'center',
      marginBottom: spacing.md,
      fontWeight: '700',
    },

    outlineBtn: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    disabled: { opacity: 0.5, borderColor: colors.textMuted },
    outlineText: { color: colors.primary, fontWeight: '700', fontSize: 16 * fontScale },

    label: {
      fontSize: 14 * fontScale,
      color: colors.text,
      fontWeight: '700',
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    pinInput: {
      borderWidth: 2,
      borderColor: colors.inputBorder,
      borderRadius: radius.md,
      height: 60,
      fontSize: 28 * fontScale,
      letterSpacing: 16,
      color: colors.text,
      marginBottom: spacing.xl,
      backgroundColor: colors.inputBackground,
    },

    backBtn: { marginTop: spacing.lg, alignSelf: 'center' },
    backText: { color: colors.textMuted, fontWeight: '700', fontSize: 16 * fontScale },
  });
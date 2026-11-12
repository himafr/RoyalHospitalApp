import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // تأكد من طريقة الاستيراد اللي ظبطتها
import SmoothScrollView from '../../components/SmoothScrollView';
import { useTheme } from '../../context/ModeContext';
import { lightMode, radius, shadow, spacing } from '../../theme';

export default function AboutScreen() {
  const { colors } = useTheme();
const styles = useMemo(() => getStyles(colors), [colors]);
  return (
    <SmoothScrollView style={styles.root}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>عيادة الشفاء</Text>
        <Text style={styles.heroSub}>إرث من الثقة ورؤية لمستقبل الرعاية الصحية</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>رسالتنا المؤسسية</Text>
        <View style={styles.card}>
          <Ionicons name="globe-outline" size={32} color={colors.primary} />
          <Text style={styles.cardText}>
            تتمحور رسالتنا حول إرساء دعائم نظام صحي متكامل يجمع بين الكفاءة التشغيلية والتميز الطبي. نحن نلتزم بتقديم رعاية آمنة ورحيمة تتجاوز توقعات المرضى، مع التركيز المستمر على تحسين الجودة النوعية للخدمات من خلال الابتكار الطبي المستمر.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>رؤيتنا الاستراتيجية</Text>
        <View style={styles.card}>
          <Ionicons name="eye-outline" size={32} color={colors.primary} />
          <Text style={styles.cardText}>
            نتطلع إلى أن نكون المرجعية الأولى للتميز الطبي والابتكار في الرعاية الصحية على مستوى المنطقة. رؤيتنا تهدف إلى قيادة التحول في القطاع الصحي الخاص عبر تبني تقنيات الذكاء الاصطناعي في التشخيص، وخلق منظومة صحية ذكية.
          </Text>
        </View>
      </View>
    </SmoothScrollView>
  );
}

const getStyles = (colors: typeof lightMode) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    hero: {
      padding: spacing.xxl,
      backgroundColor: colors.primary,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      alignItems: 'center',
    },
    heroTitle: { fontSize: 32, fontWeight: '900', color: colors.onPrimary, textAlign: 'center' },
    heroSub: { fontSize: 16, color: colors.onPrimary, opacity: 0.8, textAlign: 'center', marginTop: spacing.sm },
    section: { padding: spacing.lg },
    sectionTitle: { fontSize: 22, fontWeight: '900', color: colors.text, textAlign: 'right', marginTop: spacing.md, marginBottom: spacing.sm },
    card: {
      backgroundColor: colors.card,
      padding: spacing.lg,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
      ...shadow.card,
    },
    cardText: { fontSize: 15, color: colors.textSecondary, lineHeight: 24, marginTop: spacing.md, textAlign: 'right' },
  });
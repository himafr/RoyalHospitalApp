import { createDirectionalStyles } from '../../utils/direction';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDoctors } from '../../api/doctors';
import ErrorState from '../../components/ErrorState';
import FilterChips from '../../components/FilterChips';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenTransition from '../../components/ScreenTransition';
import { SPECIALTY_TRANSLATION_KEYS } from '../../constants';
import { useTheme } from '../../context/ModeContext';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { lightMode, radius, shadow, spacing } from '../../theme';

export default function DoctorsScreen({ navigation }: any) {
  const { colors,fontScale,t, isRTL} = useTheme();
const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);
  const [selectedSpec, setSelectedSpec] = useState('');
  const {
    data: doctors,
    loading,
    loadingMore,
    loadMore,
    refreshing,
    onRefresh,
    error,
  } = useInfiniteScroll({
    fetchApi: getDoctors,
    selectedSpec,
  });

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderDoctor = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
          {item.photo !== "default.png" ? (
            <Image style={styles.avatar} source={{ uri: item.photo }} />
          ) : (
            <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={colors.primary} />
        </View>
          )}
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <Text style={styles.specialty}>
            {item.specialtyString ||
              t(SPECIALTY_TRANSLATION_KEYS[item.specialty] || 'specialty')}
          </Text>
          <Text style={styles.name}>{t('doctor_prefix')} {item.fullName}</Text>
          <Text style={styles.experience}>
            {item.specialization || t('consultant')} - {t('doctor_experience')}
          </Text>
        </View>
      </View>
      <Text style={styles.about} numberOfLines={2}>
        {item.about || t('doctor_welcome_desc')}
      </Text>
      <PrimaryButton
        title={t('book_with_doctor')}
        variant="secondary"
        onPress={() =>
          navigation.navigate('AppointmentTab', {
            doctorId: item.id,
            specialty: item.specialty,
          })
        }
      />
    </View>
  );

  return (
    <ScreenTransition style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('doctors_title')}
        </Text>
        <Text style={styles.sub}>{t('doctors_subtitle')}</Text>
      </View>

      <FilterChips selected={selectedSpec} onSelect={setSelectedSpec} />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 50 }}
        />
      ) : error ? (
        <ErrorState message={error} onRetry={() => onRefresh()} />
      ) : (
        <FlatList
          decelerationRate="normal"
          scrollEventThrottle={16}
          overScrollMode="never"
          data={doctors}
          renderItem={renderDoctor}
          keyExtractor={item => item.id.toString()}
          onEndReached={doctors.length ? loadMore : () => {}}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: spacing.md }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {t('no_doctors')}
            </Text>
          }
        />
      )}
    </ScreenTransition>
  );
}
const getStyles = (colors: typeof lightMode, fontScale:number) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    header: { padding: spacing.lg, backgroundColor: colors.backgroundAlt },
    title: {
      fontSize: 24 * fontScale,
      fontWeight: '900',
      color: colors.text,
       
    },
    sub: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
       
      marginTop: spacing.xs,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadow.card,
    },
    cardHeader: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.secondaryLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    specialty: { fontSize: 14 * fontScale, color: colors.textSecondary, fontWeight: '700' },
    name: { fontSize: 16 * fontScale, fontWeight: '900', color: colors.text },
    experience: { fontSize: 14 * fontScale, color: colors.textMuted, marginTop: spacing.xs },
    about: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      lineHeight: 21,
       
      marginBottom: spacing.md,
    },
    empty: {
      textAlign: 'center',
      marginTop: spacing.xxl,
      color: colors.textSecondary,
      fontSize: 14 * fontScale,
      lineHeight: 21,
    },
  });
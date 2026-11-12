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
import { SPECIALTIES_STRING } from '../../constants';
import { useTheme } from '../../context/ModeContext';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { lightMode, radius, shadow, spacing } from '../../theme';

export default function DoctorsScreen({ navigation }: any) {
  const { colors } = useTheme();
const styles = useMemo(() => getStyles(colors), [colors]);
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
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={styles.specialty}>
            {item.specialtyString || SPECIALTIES_STRING[item.specialty]}
          </Text>
          <Text style={styles.name}>د. {item.fullName}</Text>
          <Text style={styles.experience}>
            {item.specialization || 'استشاري'} - خبرة 15 عاماً
          </Text>
        </View>
      </View>
      <Text style={styles.about} numberOfLines={2}>
        {item.about || 'طبيب متخصص في تقديم أفضل رعاية طبية.'}
      </Text>
      <PrimaryButton
        title="احجز مع الطبيب"
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
          نخبة <Text style={{ color: colors.primary }}>الأطباء</Text>
        </Text>
        <Text style={styles.sub}>جودة الرعاية تبدأ من اختيار الكفاءات</Text>
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
              لا يوجد أطباء متاحين في هذا التخصص.
            </Text>
          }
        />
      )}
    </ScreenTransition>
  );
}
const getStyles = (colors: typeof lightMode) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    header: { padding: spacing.lg, backgroundColor: colors.backgroundAlt },
    title: {
      fontSize: 24,
      fontWeight: '900',
      color: colors.text,
      textAlign: 'right',
    },
    sub: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'right',
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
    specialty: { fontSize: 14, color: colors.textSecondary, fontWeight: '700' },
    name: { fontSize: 16, fontWeight: '900', color: colors.text },
    experience: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
    about: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 21,
      textAlign: 'right',
      marginBottom: spacing.md,
    },
    empty: {
      textAlign: 'center',
      marginTop: spacing.xxl,
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 21,
    },
  });
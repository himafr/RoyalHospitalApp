import { createDirectionalStyles } from '../../utils/direction';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
import useDoctorSearch from '../../features/doctor/useDoctorSearch';

export default function DoctorsScreen({ navigation }: any) {
  const { colors, fontScale, t, isRTL } = useTheme();
  const styles = useMemo(
    () => createDirectionalStyles(getStyles(colors, fontScale), isRTL),
    [colors, fontScale, isRTL],
  );
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

  const {
    searchTerm,
    setSearchTerm,
    results: searchResults,
    loading: searchLoading,
    isSearching,
    clearSearch,
  } = useDoctorSearch();

  const displayedDoctors = isSearching ? searchResults : doctors;
  const isDisplayingSearch = isSearching && searchTerm.length >= 2;

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
        {item.photo !== 'default.png' ? (
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
          <Text style={styles.name}>
            {t('doctor_prefix')} {item.fullName}
          </Text>
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
        <Text style={styles.title}>{t('doctors_title')}</Text>
        <Text style={styles.sub}>{t('doctors_subtitle')}</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن طبيب..."
            placeholderTextColor={colors.textMuted}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!isSearching && (
        <FilterChips selected={selectedSpec} onSelect={setSelectedSpec} />
      )}

      {searchLoading && isSearching && (
        <View style={{ padding: spacing.lg, alignItems: 'center' }}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={{ color: colors.textMuted, marginTop: spacing.sm }}>
            جاري البحث...
          </Text>
        </View>
      )}

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
          data={displayedDoctors} // ✨ اتغيرنا دي
          renderItem={renderDoctor}
          keyExtractor={item => item.id.toString()}
          onEndReached={isDisplayingSearch ? undefined : loadMore} // ✨ بلاش Load More أثناء البحث
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshing={isDisplayingSearch ? false : refreshing} // ✨ بلاش Pull to Refresh أثناء البحث
          onRefresh={isDisplayingSearch ? undefined : onRefresh}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: spacing.md }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name={isDisplayingSearch ? 'search-outline' : 'people-outline'}
                size={48}
                color={colors.textMuted}
              />
              <Text style={styles.empty}>
                {isDisplayingSearch
                  ? `${t('no_data')} "${searchTerm}"` // ✨ أو أضف مفتاح ترجمة "لا توجد نتائج لـ"
                  : t('no_doctors')}
              </Text>
            </View>
          }
        />
      )}
    </ScreenTransition>
  );
}
const getStyles = (colors: typeof lightMode, fontScale: number) =>
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

    searchContainer: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: colors.backgroundAlt,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      marginTop: spacing.md,
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      paddingVertical: spacing.sm,
      textAlign: 'right',
      color: colors.text,
      fontSize: 14 * fontScale,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      marginTop: spacing.xl,
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
    specialty: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      fontWeight: '700',
    },
    name: { fontSize: 16 * fontScale, fontWeight: '900', color: colors.text },
    experience: {
      fontSize: 14 * fontScale,
      color: colors.textMuted,
      marginTop: spacing.xs,
    },
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

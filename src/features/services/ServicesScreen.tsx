import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getServices } from '../../api/services';
import ErrorState from '../../components/ErrorState';
import FilterChips from '../../components/FilterChips';
import ScreenTransition from '../../components/ScreenTransition';
import { useTheme } from '../../context/ModeContext';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { lightMode, radius, shadow, spacing } from '../../theme';
import { createDirectionalStyles } from '../../utils/direction';
import ServiceCard from './ServiceCard';
import useServiceSearch from './useServiceSearch';

export default function ServicesScreen({ navigation }: any) {
  const { colors, fontScale, t, isRTL } = useTheme();
  const styles = useMemo(
    () => createDirectionalStyles(getStyles(colors, fontScale), isRTL),
    [colors, fontScale, isRTL],
  );
  const [selectedSpec, setSelectedSpec] = useState('');
  const {
    data: services,
    loading,
    loadingMore,
    loadMore,
    refreshing,
    onRefresh,
    error,
  } = useInfiniteScroll({
    fetchApi: getServices,
    selectedSpec,
  });
  const {
    searchTerm,
    setSearchTerm,
    results: searchResults,
    loading: searchLoading,
    isSearching,
    clearSearch,
  } = useServiceSearch();

  const displayedServices = isSearching ? searchResults : services;
  const isDisplayingSearch = isSearching && searchTerm.length >= 2;
  const isMainLoading = isDisplayingSearch ? searchLoading : loading;

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <ScreenTransition style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('royal_healthcare')}</Text>
        <Text style={styles.sub}>{t('services_hero_desc')}</Text>
         <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن خدمة..."
            placeholderTextColor={colors.textMuted}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

 {!isSearching && <FilterChips selected={selectedSpec} onSelect={setSelectedSpec} />}

 {isMainLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : error && !isSearching ? (
        <ErrorState message={error} onRetry={() => onRefresh()} />
      ) : (
        <FlatList
          decelerationRate="normal"
          scrollEventThrottle={16}
          overScrollMode="never"
          data={displayedServices}
          renderItem={({ item }) => <ServiceCard service={item} />}
          keyExtractor={item => item.id.toString()}
          onEndReached={isDisplayingSearch ? undefined : loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshing={isDisplayingSearch ? false : refreshing}
          onRefresh={isDisplayingSearch ? undefined : onRefresh}
          contentContainerStyle={{ padding: spacing.md }}
          showsVerticalScrollIndicator={false}
          
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name={isDisplayingSearch ? 'search-outline' : 'medkit-outline'}
                size={48}
                color={colors.textMuted}
              />
              <Text style={styles.emptyText}>
                {isDisplayingSearch
                  ? `لا توجد نتائج لـ "${searchTerm}"`
                  : 'لا توجد خدمات متاحة حالياً. اختر تخصصاً آخر أو تحقق لاحقاً.'}
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
      fontSize: 14*fontScale,
    },

    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      marginTop: spacing.xl,
    },
     emptyText: {
      fontSize: 14*fontScale,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadow.card,
    },
    iconHolder: {
      width: 56,
      height: 56,
      borderRadius: radius.md,
      backgroundColor: colors.secondaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
      alignSelf: 'flex-start',
    },
    name: {
      fontSize: 16 * fontScale,
      fontWeight: '900',
      color: colors.text,

      marginBottom: spacing.xs,
    },
    desc: {
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      lineHeight: 21,

      marginBottom: spacing.md,
    },
    priceRow: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    price: { fontSize: 16 * fontScale, fontWeight: '900', color: colors.text },
    currency: { color: colors.iconActive, fontSize: 14 * fontScale },
    empty: {
      textAlign: 'center',
      marginTop: spacing.xxl,
      color: colors.textSecondary,
      fontSize: 14 * fontScale,
      lineHeight: 21,
    },
  });
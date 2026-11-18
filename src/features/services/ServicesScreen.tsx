import { createDirectionalStyles } from '../../utils/direction';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getServices } from '../../api/services';
import ErrorState from '../../components/ErrorState';
import FilterChips from '../../components/FilterChips';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenTransition from '../../components/ScreenTransition';
import { useTheme } from '../../context/ModeContext';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { lightMode, radius, shadow, spacing } from '../../theme';
import ServiceCard from './ServiceCard';

export default function ServicesScreen({ navigation }: any) {
  const { colors,fontScale,t, isRTL} = useTheme();
const styles = useMemo(() => createDirectionalStyles(getStyles(colors,fontScale), isRTL), [colors,fontScale, isRTL]);
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
        <Text style={styles.title}>
          {t('royal_healthcare')}
        </Text>
        <Text style={styles.sub}>
          {t('services_hero_desc')}
        </Text>
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
        data={services}
        renderItem={({ item }) => <ServiceCard service={item} />}
        keyExtractor={item => item.id.toString()}
          
         
          onEndReached={services.length?loadMore:()=>{}}          
          onEndReachedThreshold={0.5}       
          ListFooterComponent={renderFooter} 
          
          
          refreshing={refreshing}
          onRefresh={onRefresh}

          contentContainerStyle={{ padding: spacing.md }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={ 
            <Text style={styles.empty}>
              {t('no_services')}
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
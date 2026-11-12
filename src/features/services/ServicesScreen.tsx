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
  const { colors } = useTheme();
const styles = useMemo(() => getStyles(colors), [colors]);
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
          رعاية صحية <Text style={{ color: colors.primary }}>ملكية</Text>
        </Text>
        <Text style={styles.sub}>
          نجمع بين الخبرة الطبية العريقة وأحدث التقنيات
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
              لا توجد خدمات متاحة حالياً. اختر تخصصاً آخر أو تحقق لاحقاً.
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
      fontSize: 16,
      fontWeight: '900',
      color: colors.text,
      textAlign: 'right',
      marginBottom: spacing.xs,
    },
    desc: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 21,
      textAlign: 'right',
      marginBottom: spacing.md,
    },
    priceRow: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    price: { fontSize: 16, fontWeight: '900', color: colors.text },
    currency: { color: colors.iconActive, fontSize: 14 },
    empty: {
      textAlign: 'center',
      marginTop: spacing.xxl,
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 21,
    },
  });
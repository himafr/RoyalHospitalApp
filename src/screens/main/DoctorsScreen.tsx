import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDoctors } from '../../api/doctors';
import FilterChips from '../../components/FilterChips';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, radius, shadow } from '../../theme';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

export default function DoctorsScreen({ navigation }: any) {
  const [selectedSpec, setSelectedSpec] = useState('');
  const {
    data: doctors,
    loading,
    loadingMore,
    loadMore,
    refreshing,
    onRefresh,
  } = useInfiniteScroll({
    fetchApi: getDoctors,
    selectedSpec,
  });

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color={colors.gold} />
      </View>
    );
  };

  const renderDoctor = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color={colors.gold} />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={styles.specialty}>
            {item.specialtyString || item.specialty}
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
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>
          نخبة <Text style={{ color: colors.gold }}>الأطباء</Text>
        </Text>
        <Text style={styles.sub}>جودة الرعاية تبدأ من اختيار الكفاءات</Text>
      </View>

      <FilterChips selected={selectedSpec} onSelect={setSelectedSpec} />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.gold}
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={doctors}
          renderItem={renderDoctor}
          keyExtractor={item => item.id.toString()}
          onEndReached={loadMore}
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: { padding: spacing.lg, backgroundColor: colors.bgLight },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
    textAlign: 'right',
  },
  sub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.goldBorder,
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
    backgroundColor: colors.goldLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialty: { fontSize: 12, color: colors.gold, fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '900', color: colors.primary },
  experience: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  about: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: spacing.md,
  },
  empty: { textAlign: 'center', marginTop: 50, color: colors.textMuted },
});

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, radius, spacing } from '../../theme';
import useDoctor from './useDoctor';

export default function EditCertificationForm({ certId:id, navigation ,refetchData}: any) {
  const { doctor,loading,getCertificationById,editCertification,deleteCertificationById } = useDoctor();
  
  const [form, setForm] = useState({
    name: '',
    place: '',
    organization: '',
    photo: 'default.png',
  });

  useEffect(() => {
      const cert = getCertificationById(id);
      if (cert) {
        setForm({
          name: cert.name || '',
          organization: cert.organization || '',
          place: cert.place || '',
          photo: cert.photo || 'default.png',
        });
    }
  }, [doctor, id]);

  const handleSave = async () => {
    try {
      await editCertification({id,fData:form})
      await refetchData();
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('خطأ', error.response?.data?.message || 'حدث خطأ');
    } 
  };

  const handleDelete = async () => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد أنك تريد حذف هذه الشهادة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: async () => {
            try {
             await deleteCertificationById(id)
              await refetchData();
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('خطأ', error.response?.data?.message || 'حدث خطأ');
            }
          }
        }
      ]
    );
  };

  if(loading && !doctor) return <ActivityIndicator />

  return (
    <View>
      <Text style={styles.label}>اسم الشهادة</Text>
      <TextInput style={styles.input} value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />

      <Text style={styles.label}>الجهة المانحة</Text>
      <TextInput style={styles.input} value={form.organization} onChangeText={(t) => setForm({ ...form, organization: t })} />

      <Text style={styles.label}>المكان</Text>
      <TextInput style={styles.input} value={form.place} onChangeText={(t) => setForm({ ...form, place: t })} />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}</Text>
      </TouchableOpacity>

      {/* زرار الحذف */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Ionicons name="trash" size={20} color={colors.white} />
        <Text style={styles.deleteBtnText}>حذف الشهادة</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, color: colors.primary, fontWeight: '700', marginBottom: spacing.xs, textAlign: 'right' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, textAlign: 'right' },
  saveBtn: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  saveBtnText: { color: colors.gold, fontWeight: '900', fontSize: 16 },
  deleteBtn: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.danger, padding: spacing.md, borderRadius: radius.md, marginTop: spacing.md, gap: spacing.sm },
  deleteBtnText: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
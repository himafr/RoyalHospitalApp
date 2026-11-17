import type { TranslationKey } from '../utils/language';

export const SPECIALTIES = [
  { id: 'GENERAL', label: 'طب عام' },
  { id: 'DENTISTRY', label: 'أسنان' },
  { id: 'DERMATOLOGY', label: 'جلدية' },
  { id: 'OPHTHALMOLOGY', label: 'عيون' },
  { id: 'CARDIOLOGY', label: 'القلب والأوعية الدموية' },
  { id: 'COSMETIC_DERMATOLOGY', label: 'الجلدية والتجميل' },
  { id: 'PEDIATRICS', label: 'طب الأطفال' },
  { id: 'FAMILY_MEDICINE', label: 'طب الأسرة' },
];
export const SPECIALTIES_STRING :Record<string,string>= {
   GENERAL: 'طب عام',
  DENTISTRY: 'أسنان',
  DERMATOLOGY: 'جلدية',
  OPHTHALMOLOGY: 'عيون',
  CARDIOLOGY: 'القلب والأوعية الدموية',
  COSMETIC_DERMATOLOGY: 'الجلدية والتجميل',
  PEDIATRICS: 'طب الأطفال',
  FAMILY_MEDICINE: 'طب الأسرة',
};

export const SPECIALTY_TRANSLATION_KEYS: Record<string, TranslationKey> = {
  GENERAL: 'specialty_general',
  DENTISTRY: 'specialty_dentistry',
  DERMATOLOGY: 'specialty_dermatology',
  OPHTHALMOLOGY: 'specialty_ophthalmology',
  CARDIOLOGY: 'specialty_cardiology',
  COSMETIC_DERMATOLOGY: 'specialty_cosmetic_dermatology',
  PEDIATRICS: 'specialty_pediatrics',
  FAMILY_MEDICINE: 'specialty_family_medicine',
};

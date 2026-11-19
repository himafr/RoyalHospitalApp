import ar from "./locales/ar.json"
import en from "./locales/en.json"
export const translations = {
    ar,en
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations['ar'];

const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;



export function formatLocalizedDate(date: string, language: Language): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return date;

  const [, year, month, day] = match;
  const monthKey = monthKeys[Number(month) - 1];
  if (!monthKey) return date;

  return `${Number(day)} ${translations[language][monthKey]} ${year}`;
}
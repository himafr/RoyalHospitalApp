import { formatLocalizedDate, translations } from '../src/utils/language';

describe('translations', () => {
  it('provides a value for every key in both supported languages', () => {
    expect(Object.keys(translations.en).sort()).toEqual(
      Object.keys(translations.ar).sort(),
    );
    expect(Object.values(translations.en).every(value => value.trim())).toBe(true);
    expect(Object.values(translations.ar).every(value => value.trim())).toBe(true);
  });

  it('formats dashboard dates with the selected language', () => {
    expect(formatLocalizedDate('2026-11-17', 'ar')).toBe('17 نوفمبر 2026');
    expect(formatLocalizedDate('2026-11-17', 'en')).toBe('17 November 2026');
    expect(formatLocalizedDate('not-a-date', 'en')).toBe('not-a-date');
  });
});

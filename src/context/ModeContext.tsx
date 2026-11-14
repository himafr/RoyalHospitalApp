import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { I18nManager } from 'react-native';
import { darkMode, lightMode } from '../theme';
import { Language, TranslationKey, translations } from '../utils/language';

type FontSize = 'small' | 'medium' | 'large';

type ThemeContextType = {
  colors: typeof lightMode;
  isDark: boolean;
  toggleMode: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontScale: number;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};
const fontScales: Record<FontSize, number> = {
  small: 0.85,
  medium: 1,
  large: 1.2,
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(true);
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [language, setLanguage] = useState<Language>('ar');
  const fontScale = fontScales[fontSize];
  const t = (key: TranslationKey) => translations[language][key] || key;
    useEffect(() => {
    const shouldBeRTL = !(language === 'ar');
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      I18nManager.allowRTL(shouldBeRTL);
    }
  }, [language]);
  const value = useMemo(
    () => ({
      colors: isDark ? darkMode : lightMode,
      isDark,
      toggleMode: () => setIsDark(v => !v),
      fontSize,
      setFontSize,
      fontScale,
       language,
      setLanguage,
      t,
    }),
    [isDark, fontSize, fontScale,language],
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { I18nManager, View } from 'react-native';
import { darkMode, lightMode } from '../theme';
import { Language, TranslationKey, translations } from '../utils/language';

type FontSize = 'small' | 'medium' | 'large';
type Preferences = { fontSize: FontSize; language: Language };
type SettingsLoadStatus = 'loading' | 'ready' | 'failed';

const FONT_SIZE_KEY = 'royal_hospital.font_size';
const LANGUAGE_KEY = 'royal_hospital.language';

type ThemeContextType = {
  colors: typeof lightMode;
  isDark: boolean;
  toggleMode: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontScale: number;
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};
const fontScales: Record<FontSize, number> = {
  small: 0.85,
  medium: 1,
  large: 1.2,
};

const isFontSize = (value: string | null): value is FontSize =>
  value === 'small' || value === 'medium' || value === 'large';

const isLanguage = (value: string | null): value is Language =>
  value === 'ar' || value === 'en';

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(true);
  const [preferences, setPreferences] = useState<Preferences>({
    fontSize: 'medium',
    language: 'ar',
  });
  const [settingsLoadStatus, setSettingsLoadStatus] =
    useState<SettingsLoadStatus>('loading');
  const touchedPreferences = useRef({ fontSize: false, language: false });
  const { fontSize, language } = preferences;
  const fontScale = fontScales[fontSize];
  const isRTL = language === 'ar';
  const t = useCallback(
    (key: TranslationKey) => translations[language][key] || key,
    [language],
  );
  const setFontSize = useCallback((size: FontSize) => {
    touchedPreferences.current.fontSize = true;
    setPreferences(current =>
      current.fontSize === size ? current : { ...current, fontSize: size },
    );
  }, []);
  const setLanguage = useCallback((lang: Language) => {
    touchedPreferences.current.language = true;
    setPreferences(current =>
      current.language === lang ? current : { ...current, language: lang },
    );
  }, []);
  const toggleMode = useCallback(() => setIsDark(value => !value), []);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const [storedFontSize, storedLanguage] = await Promise.all([
          AsyncStorage.getItem(FONT_SIZE_KEY),
          AsyncStorage.getItem(LANGUAGE_KEY),
        ]);
        if (!isMounted) return;

        setPreferences(current => ({
          fontSize: touchedPreferences.current.fontSize
            ? current.fontSize
            : isFontSize(storedFontSize)
              ? storedFontSize
              : 'medium',
          language: touchedPreferences.current.language
            ? current.language
            : isLanguage(storedLanguage)
              ? storedLanguage
              : 'ar',
        }));
        setSettingsLoadStatus('ready');
      } catch (error) {
        console.error('Failed to load saved app settings', error);
        if (isMounted) setSettingsLoadStatus('failed');
      }
    };

    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (settingsLoadStatus !== 'ready') return;

    Promise.all([
      AsyncStorage.setItem(FONT_SIZE_KEY, fontSize),
      AsyncStorage.setItem(LANGUAGE_KEY, language),
    ]).catch(error => {
      console.error('Failed to save app settings', error);
    });
  }, [fontSize, language, settingsLoadStatus]);

  useEffect(() => {
    if (settingsLoadStatus === 'loading') return;
    const shouldBeRTL = isRTL;
    if (I18nManager.isRTL === shouldBeRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      I18nManager.allowRTL(shouldBeRTL);
    }
  }, [isRTL, settingsLoadStatus]);

  const value = useMemo(
    () => ({
      colors: isDark ? darkMode : lightMode,
      isDark,
      toggleMode,
      fontSize,
      setFontSize,
      fontScale,
      language,
      isRTL,
      setLanguage,
      t,
    }),
    [
      isDark,
      toggleMode,
      fontSize,
      setFontSize,
      fontScale,
      language,
      isRTL,
      setLanguage,
      t,
    ],
  );
  return (
    <ThemeContext.Provider value={value}>
      <View style={{ flex: 1, direction: isRTL ? 'rtl' : 'ltr' }}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

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
import { Settings } from '../../types/settings';

type FontSize = 'SMALL' | 'MEDIUM' | 'LARGE';
type Preferences = { fontSize: FontSize; language: Language; isDark: boolean };
type SettingsLoadStatus = 'loading' | 'ready' | 'failed';

const FONT_SIZE_KEY = 'royal_hospital.font_size';
const LANGUAGE_KEY = 'royal_hospital.language';

type ThemeContextType = {
  colors: typeof lightMode;
  isDark: boolean;
  toggleMode: () => void;
  setMode: (v: boolean) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontScale: number;
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};
const fontScales: Record<FontSize, number> = {
  SMALL: 0.85,
  MEDIUM: 1,
  LARGE: 1.2,
};

const isFontSize = (value: string | null): value is FontSize =>
  value === 'SMALL' || value === 'MEDIUM' || value === 'LARGE';

const isLanguage = (value: string | null): value is Language =>
  value === 'ar' || value === 'en';

const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean';

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<Preferences>({
    fontSize: 'MEDIUM',
    language: 'ar',
    isDark: true,
  });
  const [settingsLoadStatus, setSettingsLoadStatus] =
    useState<SettingsLoadStatus>('loading');
  const touchedPreferences = useRef({
    fontSize: false,
    language: false,
    isDark: false,
  });
  const { fontSize, language, isDark } = preferences;
  const fontScale = fontScales[fontSize];
  const isRTL = language === 'ar';
  const t = useCallback(
    (key: TranslationKey) => translations[language][key] || key,
    [language],
  );
  const savePreferences = useCallback(
    async (v: Preferences) => {
      const settings: Settings = {
        darkMode: v.isDark,
        fontSize: v.fontSize,
        language: v.language,
      };
      await AsyncStorage.setItem('settings', JSON.stringify(settings));
    },
    [],
  );
  const setFontSize = useCallback(
    (size: FontSize) => {
      touchedPreferences.current.fontSize = true;
      setPreferences(current => {
        const v =
          current.fontSize === size ? current : { ...current, fontSize: size };
        savePreferences(v);
        return v;
      });
    },
    [savePreferences],
  );
  const setLanguage = useCallback(
    (lang: Language) => {
      touchedPreferences.current.language = true;
      setPreferences(current => {
        const v =
          current.language === lang ? current : { ...current, language: lang };
        savePreferences(v);
        return v;
      });
    },
    [savePreferences],
  );
  const toggleMode = useCallback(() => {
    touchedPreferences.current.isDark = true;
    setPreferences(value => {
      const v = { ...value, isDark: !value.isDark };
      savePreferences(v);
      return v;
    });
  }, [savePreferences]);
  const setMode = useCallback(
    (isDark: boolean) => {
      touchedPreferences.current.isDark = true;
      setPreferences(a => {
        const v = { ...a, isDark };
        savePreferences(v);
        return v;
      });
    },
    [savePreferences],
  );

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('settings');
        if (!isMounted) return;

        if (!storedSettings) {
          setSettingsLoadStatus('ready');
          return;
        }

        const stored = JSON.parse(storedSettings) as
          | (Partial<Settings> & { isDark?: boolean })
          | null;

        setPreferences(current => {
          const storedDarkMode = isBoolean(stored?.darkMode)
            ? stored.darkMode
            : isBoolean(stored?.isDark)
            ? stored.isDark
            : true;

          return {
            fontSize: touchedPreferences.current.fontSize
              ? current.fontSize
              : isFontSize(stored?.fontSize ?? null)
              ? stored!.fontSize!
              : 'MEDIUM',
            language: touchedPreferences.current.language
              ? current.language
              : isLanguage(stored?.language ?? null)
              ? stored!.language!
              : 'ar',
            isDark: touchedPreferences.current.isDark
              ? current.isDark
              : storedDarkMode,
          };
        });
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
      isDark: isDark,
      toggleMode,
      fontSize,
      setFontSize,
      fontScale,
      language,
      isRTL,
      setLanguage,
      setMode,
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
      setMode,
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

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
import {  View } from 'react-native';
import { darkMode, lightMode } from '../theme';
import { Language, TranslationKey, translations } from '../i18n/index';
import { Settings } from '../../types/settings';
import { updateSettings } from '../api/settings';
import { ErrorToast } from 'react-native-toast-message';
import { showErrorToast } from '../utils/toast';

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

const normalizeFontSize = (value: string | null): FontSize | null => {
  switch (value?.toUpperCase()) {
    case 'SMALL':
      return 'SMALL';
    case 'MEDIUM':
      return 'MEDIUM';
    case 'LARGE':
      return 'LARGE';
    default:
      return null;
  }
};

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
      try{

        await updateSettings(settings)
        await AsyncStorage.setItem('settings', JSON.stringify(settings));
      }catch (e){
        if(e instanceof Error){
          showErrorToast(e.message,e.name)
        }else{
          showErrorToast("something went wrong.","Internal Error")
        }
        
      }
    },
    [],
  );
  const setFontSize = useCallback(
    (size: FontSize) => {
      const normalizedSize = normalizeFontSize(size);
      if (!normalizedSize) return;
      touchedPreferences.current.fontSize = true;
      setPreferences(current => {
        const v =
          current.fontSize === normalizedSize
            ? current
            : { ...current, fontSize: normalizedSize };
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
          const storedFontSize = normalizeFontSize(
            stored?.fontSize ?? null,
          );

          return {
            fontSize: touchedPreferences.current.fontSize
              ? current.fontSize
              : storedFontSize
              ? storedFontSize
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
    
  }, [settingsLoadStatus]);

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

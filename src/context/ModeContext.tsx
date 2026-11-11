import { createContext, ReactNode, useContext } from "react";
import { darkMode, lightMode } from "../theme";


type ThemeContextType = {
  colors: typeof lightMode;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  colors: lightMode,
  isDark: false,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const isDark = true;
  
  return (
    <ThemeContext.Provider value={{ colors: isDark ? darkMode : lightMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
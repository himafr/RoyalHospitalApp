import { createContext, ReactNode, useContext, useState } from "react";
import { darkMode, lightMode } from "../theme";


type ThemeContextType = {
  colors: typeof lightMode;
  isDark: boolean;
  toggleMode:()=>void
};

const ThemeContext = createContext<ThemeContextType>({
  colors: lightMode,
  isDark: false,
  toggleMode: () => {}
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark,setIsDark]=useState(true);
  
  const toggleMode = () => {
    setIsDark(v=>!v);
  };

  return (
    <ThemeContext.Provider value={{ colors: isDark ? darkMode : lightMode, isDark,toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
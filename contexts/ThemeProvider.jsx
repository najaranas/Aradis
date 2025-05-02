import { createContext, useState, useContext } from "react";
import { THEME } from "../constants/theme";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(
    colorScheme ? colorScheme.toUpperCase() : "LIGHT"
  );

  const toggleTheme = (theme) => {
    if (theme === "LIGHT" || theme === "DARK") {
      setTheme(theme);
      return;
    }
    setTheme((prevTheme) => (prevTheme === "LIGHT" ? "DARK" : "LIGHT"));
  };

  return (
    <ThemeContext.Provider value={{ theme: THEME[theme], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

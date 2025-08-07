import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { fonts } from '../utils/typography';

const lightTheme = {
  background: '#f8f9fa',
  text: '#222',
  inputBg: '#fff',
  inputBorder: '#ddd',
  placeholder: '#999',
  button: '#ff0000ff',
  buttonDisabled: '#999',
  subtitle: '#666',
  customColor: '#007bff',
  fontFamily: fonts.regular,
};

const darkTheme = {
  background: '#181A20',
  text: '#fff',
  inputBg: '#23262F',
  inputBorder: '#333',
  placeholder: '#aaa',
  button: '#ff0000ff',
  buttonDisabled: '#999',
  subtitle: '#aaa',
  customColor: '#007bff',
  fontFamily: fonts.regular,
};
const card = {
  background: '#fff',
  border: '#ddd',
  shadow: '#000',
};

const ThemeContext = createContext(lightTheme);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);

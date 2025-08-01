import React, { createContext, useContext, useState } from 'react';
import { Text, StyleSheet, Animated, ViewStyle, TextStyle } from 'react-native';
import { useAppTheme } from './ThemeContext';

type ToastContextType = {
  showToast: (message: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState({ message: '', visible: false });
  const [position] = useState(new Animated.Value(-100));
  const theme = useAppTheme();

  const showToast = (message: string, duration: number = 1500) => {
    setToast({ message, visible: true });

    Animated.timing(position, {
      toValue: 50,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(position, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setToast({ message: '', visible: false });
      });
    }, duration);
  };

  const dynamicStyles = createDynamicStyles(theme);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <Animated.View
          style={[
            dynamicStyles.toastContainer,
            {
              transform: [{ translateY: position }],
            },
          ]}>
          <Text style={dynamicStyles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Dynamic styles based on theme
const createDynamicStyles = (
  theme: any
): {
  toastContainer: ViewStyle;
  toastText: TextStyle;
} =>
  StyleSheet.create({
    toastContainer: {
      minWidth: 200,
      maxWidth: '80%',
      position: 'absolute',
      top: 40,
      alignSelf: 'center',
      backgroundColor: theme.inputBg,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      zIndex: 9999,

      borderColor: theme.inputBorder,
      borderWidth: 1,
    },
    toastText: {
      color: theme.text,
      fontSize: 14,
      textAlign: 'center',
      paddingHorizontal: 5,
    },
  });

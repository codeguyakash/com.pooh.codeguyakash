import React, { createContext, useContext, useState } from 'react';
import { Text, StyleSheet, Animated, ViewStyle, TextStyle } from 'react-native';
import { useAppTheme } from './ThemeContext';

type ToastContextType = {
  showToast: (message: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState({ message: '', visible: false });
  const fadeAnim = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(0))[0];
  const scale = useState(new Animated.Value(1))[0];
  const theme = useAppTheme();

  const showToast = (message: string, duration = 1500) => {
    setToast({ message, visible: true });

    // Reset values
    fadeAnim.setValue(0);
    translateY.setValue(10);
    scale.setValue(1);

    // Fade in and rise slightly
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Vanish effect after duration
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.95,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
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
              opacity: fadeAnim,
              transform: [{ translateY: translateY }, { scale: scale }],
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

const createDynamicStyles = (
  theme: any
): {
  toastContainer: ViewStyle;
  toastText: TextStyle;
} =>
  StyleSheet.create({
    toastContainer: {
      minWidth: 120,
      maxWidth: '80%',
      position: 'absolute',
      top: 40,
      alignSelf: 'center',
      backgroundColor: theme.inputBg,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 8,
      zIndex: 9999,
      borderColor: theme.inputBorder,
      borderWidth: 1,
    },
    toastText: {
      color: theme.text,
      fontSize: 14,
      textAlign: 'center',
    },
  });

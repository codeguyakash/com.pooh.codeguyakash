import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import { Text, StyleSheet, Animated, ViewStyle, TextStyle } from 'react-native';
import { useAppTheme } from './ThemeContext';

type ToastContextType = {
  showToast: (message: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState({ message: '', visible: false });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const theme = useAppTheme();

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const showToast = (message: string, duration = 1500) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({ message, visible: true });

    // Reset animation values
    fadeAnim.setValue(0);
    translateY.setValue(10);
    scale.setValue(1);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    timeoutRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -15,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.95,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToast({ message: '', visible: false });
      });
    }, duration);
  };

  const styles = createStyles(theme);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY }, { scale }],
            },
          ]}
          pointerEvents="box-none">
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const createStyles = (
  theme: any
): {
  toastContainer: ViewStyle;
  toastText: TextStyle;
} =>
  StyleSheet.create({
    toastContainer: {
      position: 'absolute',
      top: 40,
      alignSelf: 'center',
      backgroundColor: theme.inputBg || '#333',
      borderColor: theme.inputBorder || '#555',
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 8,
      zIndex: 9999,
      elevation: 10, // Android
      minWidth: 120,
      maxWidth: '80%',
    },
    toastText: {
      color: theme.text || '#fff',
      fontSize: 14,
      textAlign: 'center',
    },
  });

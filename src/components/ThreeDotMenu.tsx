import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { navigationRef } from '../navigation/navigationRef';
import { useAuth } from '../context/AuthContext';
import { logout } from '../api/modules/authApi';
import { useToast } from '../context/ToastContext';
import { useAppTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface MenuItem {
  label: string;
  onPress: () => void;
}

interface UserInfo {
  id: number;
  uuid: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string;
  is_verified: boolean;
  fcm_token: string;
}

const ThreeDotMenu = () => {
  const [visible, setVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const theme = useAppTheme();

  useEffect(() => {
    (async () => {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        console.log('User Info:', JSON.parse(userInfo));
        setUserInfo(JSON.parse(userInfo));
      }
    })();
  }, []);

  const { logout: authLogout } = useAuth();
  const { showToast } = useToast();

  const toggleMenu = () => setVisible(!visible);
  const hideMenu = () => setVisible(false);
  const menuItems: MenuItem[] = [
    {
      label: 'Home',
      onPress: () => navigationRef.navigate('HomeScreen'),
    },
    {
      label: 'Chat',
      onPress: () => navigationRef.navigate('ChatScreen'),
    },

    {
      label: 'Dashboard',
      onPress: () => navigationRef.navigate('DashboardScreen'),
    },
    {
      label: 'Profile',
      onPress: () =>
        navigationRef.navigate('ProfileScreen', {
          name: userInfo?.name || 'User',
        }),
    },
    {
      label: 'Settings',
      onPress: () => navigationRef.navigate('SettingsScreen'),
    },
    {
      label: 'Logout',
      onPress: async () => {
        try {
          await logout();
          authLogout();
          showToast('Logout successful!');
        } catch (error: any) {
          console.error('Logout failed:', error.message);
          showToast('Logout failed. Please try again.');
        }
      },
    },
  ];

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={toggleMenu} style={styles.dotsButton}>
        <Text style={[styles.dotsIcon, { color: theme.text }]}>⋮</Text>
      </TouchableOpacity>

      {visible && (
        <View style={[styles.menuBox, { backgroundColor: theme.background }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                item.onPress();
                hideMenu();
              }}>
              <Text style={[styles.menuItem, { color: theme.text }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default ThreeDotMenu;

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  dotsButton: {
    padding: 8,
  },
  dotsIcon: {
    fontSize: 24,
    fontWeight: '500',
  },
  menuBox: {
    position: 'absolute',
    top: 50,
    right: -10,
    borderRadius: 3,
    elevation: 5,
    zIndex: 99,
    paddingVertical: 6,
    minWidth: 150,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});

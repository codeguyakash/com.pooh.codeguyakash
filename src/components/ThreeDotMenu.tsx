import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { navigationRef } from '../navigation/navigationRef';

interface MenuItem {
  label: string;
  onPress: () => void;
}

interface Props {
  iconColor?: string;
  menuStyle?: ViewStyle;
}

const ThreeDotMenu: React.FC<Props> = ({ iconColor = '#000', menuStyle }) => {
  const [visible, setVisible] = useState(false);

  const toggleMenu = () => setVisible(!visible);
  const hideMenu = () => setVisible(false);
  const menuItems: MenuItem[] = [
    {
      label: 'Chat',
      onPress: () => navigationRef.navigate('ChatScreen'),
    },
    {
      label: 'Settings',
      onPress: () => navigationRef.navigate('SettingsScreen'),
    },
    {
      label: 'Home',
      onPress: () => navigationRef.navigate('HomeScreen'),
    },
    {
      label: 'Dashboard',
      onPress: () => navigationRef.navigate('DashboardScreen'),
    },
    {
      label: 'Profile',
      onPress: () => navigationRef.navigate('ProfileScreen'),
    },
  ];

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={toggleMenu} style={styles.dotsButton}>
        <Text style={[styles.dotsIcon, { color: iconColor }]}>⋮</Text>
      </TouchableOpacity>

      {visible && (
        <View style={[styles.menuBox, menuStyle]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                item.onPress();
                hideMenu();
              }}>
              <Text style={styles.menuItem}>{item.label}</Text>
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
    fontSize: 22,
  },
  menuBox: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 6,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 99,
    paddingVertical: 6,
    minWidth: 120,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});

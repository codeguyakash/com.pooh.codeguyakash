import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout, getUserData } from '../../api/modules/authApi';
import { useToast } from '../../context/ToastContext';
import { getDeviceInfo } from '../../utils/deviceInfo';

import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { navigate, navigationRef } from '../../navigation/navigationRef';

import verified from '../../assets/icons/verified.png';
import logo from '../../assets/icons/logo.png';
import { useAppTheme } from '../../context/ThemeContext';
import ThreeDotMenu from '../../components/ThreeDotMenu';

const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [device, setDevice] = useState<any>(null);
  const { logout: authLogout } = useAuth();
  const { socket, sendMessage } = useSocket();
  const { showToast } = useToast();
  const theme = useAppTheme();

  useEffect(() => {
    sendMessage({
      message: `${navigationRef.getCurrentRoute()?.name} Rendered`,
    });
    (async () => {
      const info = await getDeviceInfo();
      let fcm_token: string = String(await AsyncStorage.getItem('fcm_token'));
      if (fcm_token) {
        info.fcm_token = fcm_token;
      }
      setDevice(info);
    })();
  }, []);

  useEffect(() => {
    userData();
  }, [navigation]);

  async function userData() {
    setLoading(true);
    let userId = String(await AsyncStorage.getItem('userId'));

    try {
      let response = await getUserData(userId);

      const { user } = response.data;
      if (response.success && response.data) {
        setUser(user);
        AsyncStorage.setItem('fcm_token', user.fcm_token || '');
      }
      setLoading(false);
    } catch (error: any) {
      console.log('Data not found');
      setLoading(false);
    }
  }
  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();
      authLogout();
      setUser(null);
      showToast('Logout successful!');
    } catch (error: any) {
      console.error('Logout failed:', error.message);
      showToast('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToChat = () => {
    console.log('CLICKED CHAT');
    navigate('ChatScreen');
    if (socket && socket.connected) {
      console.log('✅ Socket is connected, navigating to Chat');
      navigate('ChatScreen');
    } else {
      showToast('Socket not connected. Please wait...');
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {user ? (
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Image source={logo} style={styles.logo} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: 'black',
                  marginRight: 5,
                }}>
                {user.name}
              </Text>

              <View>
                <Text>
                  {user.is_verified ? (
                    <Image
                      source={verified}
                      style={{ width: 20, height: 20, marginLeft: 5 }}
                    />
                  ) : (
                    'Verify'
                  )}
                </Text>
              </View>
            </View>

            <Text> {user.email}</Text>
            <Text> {user.uuid}</Text>
            <Text>Current Device Info</Text>
            <View>
              {Object.entries(device).map(([key, value]) => (
                <Text style={styles.text} key={key}>
                  {key.replace(/_/g, ' ')?.toUpperCase()}
                  :-------------------- {String(value)}
                </Text>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: '#53A04A' }]}
              onPress={handleGoToChat}>
              <Text style={styles.loginOut}>CHAT</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={{ marginTop: 20 }}>No user data available</Text>
        )}

        <TouchableOpacity
          style={[
            styles.loginButton,
            { backgroundColor: loading ? theme.buttonDisabled : theme.button },
          ]}
          onPress={handleLogout}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginOut}>Logout</Text>
          )}
        </TouchableOpacity>
        <ThreeDotMenu
          iconColor="#000"
          menuItems={[
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
          ]}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#f8f9fa',
  },

  loginButton: {
    marginTop: 20,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginOut: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

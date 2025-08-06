import { Text, View, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout, getUserData } from '../../api/modules/authApi';
import { useToast } from '../../context/ToastContext';
import { getDeviceInfo } from '../../utils/deviceInfo';

import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { navigationRef } from '../../navigation/navigationRef';

import verified from '../../assets/icons/verified.png';
import logo from '../../assets/icons/logo.png';
import { useAppTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';

const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [device, setDevice] = useState<any>(null);
  const { socket, sendMessage } = useSocket();

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

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Profile Screen" />
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
                  color: theme.text,
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

            <Text style={{ color: theme.text }}> {user.email}</Text>
            <Text style={{ color: theme.text }}> {user.uuid}</Text>
            <Text style={{ color: theme.text }}>Current Device Info</Text>
          </View>
        ) : (
          <Text style={{ marginTop: 20 }}>No user data available</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    marginTop: 10,
    paddingHorizontal: 20,
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

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout, getUserData } from '../api/modules/authApi';
import { useToast } from '../context/ToastContext';
import { getDeviceInfo } from '../utils/deviceInfo';

import { useAuth } from '../context/AuthContext';

const Profile = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [device, setDevice] = useState<any>(null);
  const { logout: authLogout } = useAuth();

  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      const info = await getDeviceInfo();
      setDevice(info);
    })();
  }, []);

  //  const ws = new WebSocket(`wss://${SOCKET_BASE_URL}`);
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

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {user ? (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            {/* Avatar */}
            <View style={styles.Avatar}>
              <Text style={styles.AvatarText}>
                {user?.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
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
              <View
                style={[
                  styles.verifiedBadge,
                  user.is_verified
                    ? { borderColor: '#4A96FF', backgroundColor: '#CCE1FF' }
                    : { borderColor: '#53A04A', backgroundColor: '#CEE4CC' },
                ]}>
                <Text style={styles.verifiedText}>
                  {user.is_verified ? 'Verified' : 'Verify'}
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
          </View>
        ) : (
          <Text style={{ marginTop: 20 }}>No user data available</Text>
        )}

        <TouchableOpacity
          style={[styles.loginButton, loading && { backgroundColor: '#999' }]}
          onPress={handleLogout}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#f8f9fa',
  },

  Avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderColor: '#d3d3d3ff',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  AvatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ff0000ff',
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#ff0000ff',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  verifiedBadge: {
    borderRadius: 20,
    height: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 12,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
});

export default Profile;

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout, getUserData } from '../api/modules/authApi';

const Profile = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userData();
  }, [navigation]);

  async function userData() {
    setLoading(true);
    let userId = String(await AsyncStorage.getItem('userId'));
    try {
      console.log(userId);
      let response = await getUserData(userId);
      console.log(response);
      console.log(response.success);
      const { user } = response.data;
      if (response.success && response.data) {
        setUser(user);
        console.log(user);
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
      console.log('Logout successful');

      setUser(null);
      await AsyncStorage.clear();
      ToastAndroid.show('Logout successful', ToastAndroid.SHORT);
      navigation.navigate('Login');
    } catch (error: any) {
      console.error('Logout failed:', error.message);
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
            <Text> {user.role}</Text>
            <Text> {user.uuid}</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 8,
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
});

export default Profile;

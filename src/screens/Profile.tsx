import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import { useEffect, useState } from 'react';
import { styles } from '../globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import verifiedBadge from '../assets/icons/verified-badge.png';

const Profile = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userData();
  }, [navigation]);

  async function userData() {
    try {
      let data = await AsyncStorage.getItem('user');
      if (data) {
        data = JSON.parse(data);
        setUser(data);
      } else {
        console.log('No user data found');
      }
    } catch (error: any) {
      console.log('Data not found');
    }
  }
  const handleLogout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
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
            <View style={internalStyles.Avatar}>
              <Text style={internalStyles.AvatarText}>
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
                  internalStyles.verifiedBadge,
                  user.is_verified
                    ? { borderColor: '#4A96FF', backgroundColor: '#CCE1FF' }
                    : { borderColor: '#53A04A', backgroundColor: '#CEE4CC' },
                ]}>
                <Text style={internalStyles.verifiedText}>
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
          style={[
            internalStyles.loginButton,
            loading && { backgroundColor: '#999' },
          ]}
          onPress={handleLogout}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={internalStyles.loginText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const internalStyles = StyleSheet.create({
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

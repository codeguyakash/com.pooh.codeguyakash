import React, { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../../api/modules/authApi';
import { useSocket } from '../../context/SocketContext';
import { navigationRef } from '../../navigation/navigationRef';
import { useAppTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';
import logo from '../../assets/icons/logo.png';
import verified from '../../assets/icons/verified.png';

const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { socket, sendMessage } = useSocket();
  const theme = useAppTheme();

  useEffect(() => {
    sendMessage({
      message: `${navigationRef.getCurrentRoute()?.name} Rendered`,
    });
    userData();
  }, [navigation]);

  async function userData() {
    setLoading(true);
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await getUserData(userId || '');
      if (response.success && response.data) {
        setUser(response.data.user);
        AsyncStorage.setItem('fcm_token', response.data.user.fcm_token || '');
      }
    } catch (error) {
      console.log('Data not found');
    } finally {
      setLoading(false);
    }
  }
  console.log(user);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Profile" />
        {user ? (
          <>
            <View style={styles.profileSection}>
              <Image source={logo} style={styles.avatar} />
              <TouchableOpacity>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>

              <View style={styles.infoBlock}>
                <Text style={[styles.label, { color: theme.text }]}>Name</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: theme.text }}>{user.name}</Text>

                  {user.is_verified && (
                    <Image
                      source={verified}
                      style={{ width: 20, height: 20, marginLeft: 5 }}
                    />
                  )}
                </View>
              </View>

              <View style={styles.infoBlock}>
                <Text style={[styles.label, { color: theme.text }]}>Email</Text>
                <Text style={[{ color: theme.text }]}>{user.email}</Text>
              </View>

              <View style={styles.infoBlock}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Unique ID (ID)
                </Text>
                <Text style={[{ color: theme.text }]}>
                  {user.uuid + user.id || 'N/A'}
                </Text>
              </View>

              <View style={styles.infoBlock}>
                <Text style={[styles.label, { color: theme.text }]}>Role</Text>
                <Text style={[{ color: theme.text }]}>
                  {user.role || 'N/A'}
                </Text>
              </View>

              <View style={styles.infoBlock}>
                <Text style={[styles.label, { color: theme.text }]}>
                  FCM Token
                </Text>
                <Text style={[{ color: theme.text }]}>
                  {user.fcm_token || 'N/A'}
                </Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Created At
                </Text>
                <Text style={[{ color: theme.text }]}>
                  {user.created_at || 'N/A'}
                </Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Updated At
                </Text>
                <Text style={[{ color: theme.text }]}>
                  {user.updated_at || 'N/A'}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View>
            <ActivityIndicator size="large" color={theme.text} />
            <Text style={[{ textAlign: 'center' }, { color: theme.text }]}>
              Loading...
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderColor: '#00FF7F',
    borderWidth: 1,
  },
  editText: {
    color: '#00FF7F',
    marginBottom: 30,
    fontWeight: '500',
  },
  infoBlock: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 5,
    fontWeight: '500',
  },
  label: {
    fontSize: 16,
    marginBottom: 3,
  },
});

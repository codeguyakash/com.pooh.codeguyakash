import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../../api/modules/authApi';
import { useSocket } from '../../context/SocketContext';
import { navigationRef } from '../../navigation/navigationRef';
import { useAppTheme } from '../../context/ThemeContext';

import logo from '../../assets/icons/pooh.png';
import verified from '../../assets/icons/verified.png';

import { useRoute, RouteProp } from '@react-navigation/native';
import { globalStyle } from '../../globalStyle';

type ProfileScreenRouteParams = {
  name?: string;
};

const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  // const [isUpdating, setIsUpdating] = useState(false);
  const { socket, sendMessage } = useSocket();
  const theme = useAppTheme();

  const route =
    useRoute<RouteProp<{ params: ProfileScreenRouteParams }, 'params'>>();

  useEffect(() => {
    sendMessage({
      message: `${navigationRef.getCurrentRoute()?.name} Rendered`,
    });
    userData();
  }, [navigation]);

  useEffect(() => {
    if (route.params?.name) {
      navigation.setOptions({ title: route.params.name });
    }
  }, [route.params?.name]);

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

  const formatDateAndTime = (dateString: string) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    } as const;
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {user ? (
          <>
            <View style={styles.profileSection}>
              <Image
                source={{ uri: user.avatar_url || logo }}
                style={[styles.avatar, { borderColor: theme.button }]}
              />
              <TouchableOpacity>
                <Text style={[styles.editText, { color: theme.text }]}>
                  Edit
                </Text>
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
                  {formatDateAndTime(user.created_at) || 'N/A'}
                </Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Updated At
                </Text>
                <Text style={[{ color: theme.text }]}>
                  {formatDateAndTime(user.updated_at) || 'N/A'}
                </Text>
              </View>
            </View>
            <View style={{ paddingHorizontal: 20 }}>
              <TouchableOpacity
                style={[
                  globalStyle.button,
                  {
                    backgroundColor: loading
                      ? theme.buttonDisabled
                      : theme.button,
                  },
                ]}
                onPress={() =>
                  Alert.alert(
                    'Feature under development',
                    'This feature is under development.'
                  )
                }
                activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={[styles.updateInfo]}>UPDATE</Text>
                )}
              </TouchableOpacity>
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
  },
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
  },
  editText: {
    marginBottom: 30,
    fontWeight: '500',
  },
  updateInfo: {
    fontWeight: '500',
    color: '#fff',
  },
  infoBlock: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 5,
    fontWeight: '500',
    borderBottomColor: '#d0d0d0ff',
    borderBottomWidth: 0.2,
  },
  label: {
    fontSize: 16,
    marginBottom: 3,
  },
});

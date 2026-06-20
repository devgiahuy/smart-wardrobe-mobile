import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { secureStorage } from '@/lib/storage';
import { authApi } from '@/features/auth/api/auth.api';
import { registerForPushNotificationsAsync, setupNotificationListeners } from '@/lib/notifications';

export default function Index() {
  const { isAuthenticated, login, logout } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Register Push Notifications
        registerForPushNotificationsAsync().then((token: string | null) => {
          if (token) console.log('Push Token:', token);
        });

        const token = await secureStorage.getItemAsync('accessToken');
        if (token) {
          // Verify token by getting user
          const user = await authApi.getMe();
          login(user);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setIsInitializing(false);
      }
    };
    
    initApp();
    const cleanupNotifications = setupNotificationListeners();

    return () => {
      cleanupNotifications?.();
    };
  }, [login, logout]);

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/community" />;
  }

  return <Redirect href="/(auth)/login" />;
}

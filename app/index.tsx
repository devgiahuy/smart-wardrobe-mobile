import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { secureStorage } from '@/lib/storage';
import { authApi } from '@/features/auth/api/auth.api';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/lib/notifications';

export default function Index() {
  const { isAuthenticated, login, logout } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    const initApp = async () => {
      try {
        // Register Push Notifications
        registerForPushNotificationsAsync().then(token => console.log('Push Token:', token));

        // Listeners
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          console.log('Notification Received:', notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log('Notification Response:', response);
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

    return () => {
      if (notificationListener.current) Notifications.removeNotificationSubscription?.(notificationListener.current);
      if (responseListener.current) Notifications.removeNotificationSubscription?.(responseListener.current);
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
    return <Redirect href="/(tabs)/wardrobe" />;
  }

  return <Redirect href="/(auth)/login" />;
}

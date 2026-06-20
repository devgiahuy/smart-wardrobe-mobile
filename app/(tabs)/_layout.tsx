import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Shirt, Sparkles, Users, User } from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="wardrobe"
        options={{
          title: 'Tủ đồ',
          tabBarIcon: ({ color }) => <Shirt size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="outfits"
        options={{
          title: 'Bộ phối',
          tabBarIcon: ({ color }) => <Shirt size={24} color={color} />, // Will use a different icon like Layers or Image
        }}
      />
      <Tabs.Screen
        name="ai-stylist"
        options={{
          title: 'AI Stylist',
          tabBarIcon: ({ color }) => <Sparkles size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Cộng đồng',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

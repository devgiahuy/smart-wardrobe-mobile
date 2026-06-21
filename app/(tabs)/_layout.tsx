import { Tabs } from 'expo-router';
import { Shirt, Sparkles, LayoutGrid, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#7e7576',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#eeeeee',
        },
      }}
    >
      <Tabs.Screen
        name="wardrobe"
        options={{
          title: 'Tủ Đồ',
          tabBarIcon: ({ color }) => <Shirt color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="outfits"
        options={{
          title: 'Phối Đồ',
          tabBarIcon: ({ color }) => <LayoutGrid color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="ai-stylist"
        options={{
          title: 'AI Stylist',
          tabBarIcon: ({ color }) => <Sparkles color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá Nhân',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}

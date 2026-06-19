import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Shirt, PlusCircle, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tủ đồ',
          tabBarIcon: ({ color }) => <Shirt color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Thêm mới',
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}

import React from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Shirt } from 'lucide-react-native';
import { View, Text, Pressable } from '../../src/tw';

export default function LoginScreen() {
  const router = useRouter();
  const mockLogin = useAuthStore((state) => state.mockLogin);

  const handleMockLogin = () => {
    mockLogin();
    router.replace('/(tabs)/wardrobe');
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <View className="items-center mb-12">
        <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4">
          <Shirt color="#ffffff" size={40} />
        </View>
        <Text className="font-display-xl text-3xl text-primary text-center">Smart Wardrobe</Text>
        <Text className="font-body-md text-secondary text-center mt-2">
          Số hóa và quản lý tủ đồ của bạn dễ dàng hơn bao giờ hết
        </Text>
      </View>

      <Pressable
        onPress={handleMockLogin}
        className="w-full bg-primary py-4 rounded-xl flex-row justify-center items-center active:opacity-80"
      >
        <Text className="font-headline-md text-on-primary text-lg">Đăng nhập (Mock)</Text>
      </Pressable>

      <Pressable className="mt-6">
        <Text className="font-body-md text-outline">Chưa có tài khoản? Đăng ký ngay</Text>
      </Pressable>
    </View>
  );
}

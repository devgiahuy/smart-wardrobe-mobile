import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, LogOut, ChevronRight, Edit3, ShoppingBag, CreditCard, Star } from 'lucide-react-native';
import { router } from 'expo-router';

import { useAuthStore } from '@/store/useAuthStore';
import { secureStorage } from '@/lib/storage';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất không?', [
      { text: 'Hủy', style: 'cancel' },
      { 
        text: 'Đăng xuất', 
        style: 'destructive',
        onPress: async () => {
          await secureStorage.deleteItemAsync('accessToken');
          await secureStorage.deleteItemAsync('refreshToken');
          logout();
          router.replace('/(auth)/login');
        }
      }
    ]);
  };

  const menuItems = [
    { id: 'edit', title: 'Chỉnh sửa thông tin', icon: Edit3, onPress: () => router.push('/(tabs)/profile/edit') },
    { id: 'wallet', title: 'Ví điện tử', icon: CreditCard, onPress: () => router.push('/(tabs)/profile/wallet') },
    { id: 'listings', title: 'Quản lý pass đồ', icon: ShoppingBag, onPress: () => Alert.alert('Thông báo', 'Tính năng đang được phát triển') },
    { id: 'subscription', title: 'Gói hội viên', icon: Star, onPress: () => router.push('/(tabs)/profile/subscription') },
    { id: 'settings', title: 'Cài đặt', icon: Settings, onPress: () => Alert.alert('Thông báo', 'Tính năng đang được phát triển') },
  ];

  return (
    <SafeAreaView className="flex-1 bg-muted" edges={['top']}>
      {/* Header */}
      <View className="bg-background px-4 py-3 border-b border-input flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-foreground">Hồ Sơ</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Info */}
        <View className="bg-background p-6 mb-4 items-center border-b border-input">
          <View className="w-24 h-24 rounded-full bg-muted overflow-hidden mb-4 border-2 border-primary/20">
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="flex-1 items-center justify-center bg-primary">
                <Text className="text-primary-foreground font-bold text-3xl">{user?.username?.charAt(0).toUpperCase() || 'U'}</Text>
              </View>
            )}
          </View>
          <Text className="text-xl font-bold text-foreground mb-1">
            {user?.firstName && user?.lastName ? `${user.lastName} ${user.firstName}` : user?.username || 'Người dùng'}
          </Text>
          <Text className="text-muted-foreground">{user?.email}</Text>
          
          <View className="flex-row items-center mt-4 bg-primary/10 px-4 py-1.5 rounded-full">
            <Star size={14} color="#000" className="mr-1" fill="#000" />
            <Text className="text-primary font-bold text-sm">Thành viên thường</Text>
          </View>
        </View>

        {/* Stats (Mocked for now) */}
        <View className="bg-background mb-4 border-y border-input flex-row">
          <View className="flex-1 py-4 items-center border-r border-input">
            <Text className="font-bold text-lg text-foreground">0</Text>
            <Text className="text-xs text-muted-foreground uppercase mt-1">Trang phục</Text>
          </View>
          <View className="flex-1 py-4 items-center border-r border-input">
            <Text className="font-bold text-lg text-foreground">0</Text>
            <Text className="text-xs text-muted-foreground uppercase mt-1">Bộ phối</Text>
          </View>
          <View className="flex-1 py-4 items-center">
            <Text className="font-bold text-lg text-foreground">0</Text>
            <Text className="text-xs text-muted-foreground uppercase mt-1">Bài viết</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-background border-y border-input">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={item.onPress}
                className={`flex-row items-center px-6 py-4 ${index !== menuItems.length - 1 ? 'border-b border-input' : ''}`}
              >
                <View className="w-8 h-8 rounded-full bg-muted items-center justify-center mr-4">
                  <Icon size={16} color="#000" />
                </View>
                <Text className="flex-1 text-base font-medium text-foreground">{item.title}</Text>
                <ChevronRight size={20} color="#999" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-background border-y border-input mt-6 flex-row items-center justify-center py-4"
        >
          <LogOut size={20} color="#EF4444" className="mr-2" />
          <Text className="text-[#EF4444] font-bold text-base">Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

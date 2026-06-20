import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Edit2, Trash2 } from 'lucide-react-native';

import { useGetWardrobeItemDetail, useDeleteWardrobeItemMutation } from '@/features/wardrobe/queries/wardrobe.queries';

export default function WardrobeItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: item, isLoading, isError } = useGetWardrobeItemDetail(id);
  const deleteMutation = useDeleteWardrobeItemMutation();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !item) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-foreground">Không tìm thấy trang phục.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-4 py-2 bg-primary rounded-lg">
          <Text className="text-primary-foreground">Trở về</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Xóa trang phục',
      'Bạn có chắc chắn muốn xóa trang phục này khỏi tủ đồ không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(item.id);
              Alert.alert('Thành công', 'Đã xóa trang phục.');
              router.back();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa trang phục.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-input">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">Chi tiết</Text>
        <View className="flex-row space-x-4">
          <TouchableOpacity onPress={() => router.push(`/(tabs)/wardrobe/edit/${item.id}`)} className="mr-3">
            <Edit2 size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Trash2 size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="w-full aspect-square bg-muted">
          <Image source={{ uri: item.imageUrl }} className="w-full h-full" resizeMode="cover" />
        </View>

        <View className="p-6">
          <Text className="text-2xl font-bold text-foreground mb-1">{item.category?.name || 'Trang phục'}</Text>
          <Text className="text-muted-foreground mb-6 text-sm">
            Thêm vào ngày {new Date(item.createdAt).toLocaleDateString('vi-VN')}
          </Text>

          {/* Properties */}
          <View className="space-y-4">
            <View className="flex-row justify-between py-3 border-b border-input">
              <Text className="text-muted-foreground">Màu sắc</Text>
              <View className="flex-row items-center space-x-2">
                {item.colorHex && (
                  <View 
                    style={{ backgroundColor: item.colorHex }} 
                    className="w-4 h-4 rounded-full border border-gray-300" 
                  />
                )}
                <Text className="text-foreground font-medium capitalize">{item.color || 'Chưa xác định'}</Text>
              </View>
            </View>

            <View className="flex-row justify-between py-3 border-b border-input">
              <Text className="text-muted-foreground">Kiểu dáng</Text>
              <Text className="text-foreground font-medium capitalize">{item.fit || 'Chưa xác định'}</Text>
            </View>

            <View className="flex-row justify-between py-3 border-b border-input">
              <Text className="text-muted-foreground">Chất liệu</Text>
              <Text className="text-foreground font-medium capitalize">{item.material || 'Chưa xác định'}</Text>
            </View>

            <View className="flex-row justify-between py-3 border-b border-input">
              <Text className="text-muted-foreground">Họa tiết</Text>
              <Text className="text-foreground font-medium capitalize">{item.pattern || 'Chưa xác định'}</Text>
            </View>

            <View className="flex-row justify-between py-3 border-b border-input">
              <Text className="text-muted-foreground">Mùa</Text>
              <Text className="text-foreground font-medium capitalize">{item.seasonality || 'Chưa xác định'}</Text>
            </View>

            <View className="flex-row justify-between py-3 border-b border-input">
              <Text className="text-muted-foreground">Phong cách</Text>
              <Text className="text-foreground font-medium capitalize">{item.style || 'Chưa xác định'}</Text>
            </View>

            {item.price !== undefined && item.price !== null && (
              <View className="flex-row justify-between py-3 border-b border-input">
                <Text className="text-muted-foreground">Giá</Text>
                <Text className="text-foreground font-medium">{item.price.toLocaleString('vi-VN')} đ</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

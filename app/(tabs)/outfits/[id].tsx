import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2 } from 'lucide-react-native';

import { useGetOutfitDetail, useDeleteOutfitMutation } from '@/features/outfits/queries/outfits.queries';

export default function OutfitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: outfit, isLoading, isError } = useGetOutfitDetail(id);
  const deleteMutation = useDeleteOutfitMutation();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !outfit) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-foreground">Không tìm thấy bộ phối.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-4 py-2 bg-primary rounded-lg">
          <Text className="text-primary-foreground">Trở về</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Xóa bộ phối',
      'Bạn có chắc chắn muốn xóa bộ phối này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(outfit.id);
              Alert.alert('Thành công', 'Đã xóa bộ phối.');
              router.back();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa bộ phối.');
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
        <Text className="text-xl font-bold text-foreground">Chi tiết bộ phối</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Trash2 size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="w-full aspect-[3/4] bg-muted">
          {outfit.coverImageUrl ? (
            <Image source={{ uri: outfit.coverImageUrl }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-muted-foreground">Chưa có ảnh đại diện</Text>
            </View>
          )}
        </View>

        <View className="p-6">
          <Text className="text-2xl font-bold text-foreground mb-2">{outfit.name}</Text>
          {outfit.description ? (
            <Text className="text-muted-foreground mb-6 text-base leading-relaxed">
              {outfit.description}
            </Text>
          ) : null}

          <Text className="text-lg font-bold text-foreground mb-4">Các món đồ ({outfit.items?.length || 0})</Text>
          
          <View className="flex-row flex-wrap">
            {outfit.items?.map((item, index) => (
              <TouchableOpacity 
                key={item.id || index.toString()} 
                style={{ width: '30%', aspectRatio: 1, margin: '1.5%', backgroundColor: '#F0F0F0', borderRadius: 8, overflow: 'hidden' }}
                onPress={() => item.wardrobeItem && router.push(`/(tabs)/wardrobe/${item.wardrobeItem.id}`)}
              >
                {item.wardrobeItem?.imageUrl && (
                  <Image source={{ uri: item.wardrobeItem.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

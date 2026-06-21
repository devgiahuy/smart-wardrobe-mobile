import React from 'react';
import { ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useMyWardrobeItems } from '../../../src/features/wardrobe/queries/wardrobe.queries';
import { WardrobeCard } from '../../../src/features/wardrobe/components/WardrobeCard';
import { Plus } from 'lucide-react-native';
import { Pressable } from '../../../src/tw';
import { View, Text } from '../../../src/tw';

export default function WardrobeScreen() {
  const router = useRouter();
  const { data: items, isLoading, error, refetch, isRefetching } = useMyWardrobeItems();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-red-500 font-body-md">Đã có lỗi xảy ra khi tải tủ đồ</Text>
        <Pressable onPress={() => refetch()} className="mt-4 bg-primary px-4 py-2 rounded-lg">
          <Text className="text-on-primary font-body-md">Thử lại</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlashList
        data={items || []}
        renderItem={({ item }) => (
          <WardrobeCard 
            item={item} 
            onPress={() => router.push(`/wardrobe/${item.id}`)} 
          />
        )}
        estimatedItemSize={180}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="font-body-md text-secondary">Tủ đồ của bạn đang trống</Text>
          </View>
        )}
      />

      {/* Floating Action Button */}
      <Pressable
        onPress={() => router.push('/wardrobe/upload')}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
      >
        <Plus color="#ffffff" size={28} />
      </Pressable>
    </View>
  );
}

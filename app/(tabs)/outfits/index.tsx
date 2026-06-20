import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';

import { useGetMyOutfits } from '@/features/outfits/queries/outfits.queries';
import { OutfitRes } from '@/features/outfits/types';

export default function OutfitsScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching
  } = useGetMyOutfits();

  const items = data?.pages.flatMap(page => page.items) || [];

  const renderItem = ({ item }: { item: OutfitRes }) => (
    <TouchableOpacity 
      style={{ flex: 1, margin: 8, backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}
      onPress={() => router.push(`/(tabs)/outfits/${item.id}`)}
    >
      <View style={{ width: '100%', aspectRatio: 3/4, backgroundColor: '#F0F0F0' }}>
        {item.coverImageUrl ? (
          <Image source={{ uri: item.coverImageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#999' }}>Chưa có ảnh</Text>
          </View>
        )}
      </View>
      <View style={{ padding: 12 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={{ color: '#666', fontSize: 12 }} numberOfLines={1}>
          {item.items?.length || 0} món đồ
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-input">
        <Text className="text-2xl font-bold text-foreground">Bộ Phối</Text>
      </View>

      {/* Item List */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          renderItem={renderItem}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-muted-foreground text-center px-4 mb-4">
                Bạn chưa tạo bộ phối nào. Thử tạo một bộ phối mới bằng Canvas kéo thả!
              </Text>
              <TouchableOpacity
                style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#000', borderRadius: 8 }}
                onPress={() => router.push('/outfits/create')}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Tạo Bộ Phối</Text>
              </TouchableOpacity>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator />
              </View>
            ) : null
          }
        />
      )}

      {/* Floating Action Button */}
      {items.length > 0 && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#000', // primary
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={() => router.push('/outfits/create')}
        >
          <Plus size={24} color="#FFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

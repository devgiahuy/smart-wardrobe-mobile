import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Filter } from 'lucide-react-native';
import { router } from 'expo-router';

import { useGetMyWardrobeItems, useGetCategories } from '@/features/wardrobe/queries/wardrobe.queries';
import { WardrobeItemRes } from '@/features/wardrobe/types';

export default function WardrobeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  
  const { data: categoriesData } = useGetCategories();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching
  } = useGetMyWardrobeItems(selectedCategory);

  const categories = categoriesData || [];
  
  // Flatten pages
  const items = data?.pages.flatMap(page => page.items) || [];

  const renderItem = ({ item }: { item: WardrobeItemRes }) => (
    <TouchableOpacity 
      style={{ flex: 1, margin: 4, aspectRatio: 1, backgroundColor: '#F0F0F0', borderRadius: 8, overflow: 'hidden' }}
      onPress={() => router.push(`/(tabs)/wardrobe/${item.id}`)}
    >
      <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-2xl font-bold text-foreground">Tủ Đồ</Text>
        <TouchableOpacity>
          <Filter size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: 'all', name: 'Tất cả', slug: undefined }, ...categories]}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item.slug)}
              className={`px-4 py-2 mr-2 rounded-full border ${selectedCategory === item.slug || (!selectedCategory && item.id === 'all') ? 'bg-primary border-primary' : 'bg-background border-input'}`}
            >
              <Text className={selectedCategory === item.slug || (!selectedCategory && item.id === 'all') ? 'text-primary-foreground font-medium' : 'text-foreground'}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
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
          numColumns={3}
          contentContainerStyle={{ padding: 4 }}
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
              <Text className="text-muted-foreground">Chưa có trang phục nào trong tủ đồ.</Text>
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
        onPress={() => router.push('/(tabs)/wardrobe/upload')}
      >
        <Plus size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

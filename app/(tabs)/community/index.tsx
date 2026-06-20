import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Share2, Plus, LayoutGrid, Tag } from 'lucide-react-native';
import { router } from 'expo-router';

import { useGetCommunityPosts, useLikePostMutation } from '@/features/community/queries/community.queries';
import { PostRes } from '@/features/community/types';

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'OUTFIT' | 'SALE'>('OUTFIT');
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching
  } = useGetCommunityPosts({ postType: activeTab });

  const likeMutation = useLikePostMutation();

  const posts = data?.pages.flatMap(page => page.items) || [];

  const handleLike = (post: PostRes) => {
    likeMutation.mutate({ publicId: post.publicId, data: { isLiked: !post.isLiked } });
  };

  const renderPost = ({ item }: { item: PostRes }) => (
    <TouchableOpacity 
      className="bg-white mb-4 border-y border-input"
      onPress={() => router.push(`/(tabs)/community/${item.publicId}`)}
      activeOpacity={0.9}
    >
      {/* Post Header */}
      <View className="flex-row items-center px-4 py-3">
        <View className="w-10 h-10 rounded-full bg-muted overflow-hidden mr-3">
          {item.avatarUrl ? (
            <Image source={{ uri: item.avatarUrl }} className="w-full h-full" />
          ) : (
             <View className="flex-1 items-center justify-center bg-primary">
                <Text className="text-primary-foreground font-bold text-lg">{item.username?.charAt(0).toUpperCase() || 'U'}</Text>
             </View>
          )}
        </View>
        <View className="flex-1">
          <Text className="font-bold text-foreground">{item.username}</Text>
          <Text className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</Text>
        </View>
        {item.postType === 'SALE' && (
          <View className="bg-primary/10 px-3 py-1 rounded-full">
            <Text className="text-primary text-xs font-bold">PASS ĐỒ</Text>
          </View>
        )}
      </View>

      {/* Post Media */}
      {item.media && item.media.length > 0 && (
        <View className="w-full aspect-[4/5] bg-muted">
          <Image source={{ uri: item.media[0].mediaUrl }} className="w-full h-full" resizeMode="cover" />
        </View>
      )}

      {/* Post Actions */}
      <View className="flex-row items-center px-4 py-3 border-b border-input">
        <TouchableOpacity onPress={() => handleLike(item)} className="flex-row items-center mr-6">
          <Heart size={24} color={item.isLiked ? "#EF4444" : "#000"} fill={item.isLiked ? "#EF4444" : "transparent"} />
          <Text className="ml-2 text-foreground font-medium">{item.likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center mr-6">
          <MessageCircle size={24} color="#000" />
          <Text className="ml-2 text-foreground font-medium">{item.commentCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center ml-auto">
          <Share2 size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <View className="px-4 py-3">
        <Text className="text-foreground text-[15px] leading-6">
          <Text className="font-bold mr-2">{item.username}</Text> {item.title && <Text className="font-bold">[{item.title}] </Text>}{item.content}
        </Text>
        
        {item.postType === 'SALE' && item.totalPrice && (
          <Text className="mt-2 text-primary font-bold">Giá: {item.totalPrice.toLocaleString('vi-VN')} đ</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-muted" edges={['top']}>
      {/* Header */}
      <View className="bg-background px-4 py-3 border-b border-input flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-foreground">Cộng Đồng</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-background border-b border-input">
        <TouchableOpacity 
          className={`flex-1 py-3 items-center flex-row justify-center ${activeTab === 'OUTFIT' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('OUTFIT')}
        >
          <LayoutGrid size={18} color={activeTab === 'OUTFIT' ? '#000' : '#666'} className="mr-2" />
          <Text className={`font-bold ${activeTab === 'OUTFIT' ? 'text-foreground' : 'text-muted-foreground'}`}>Khoe Phối Đồ</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-3 items-center flex-row justify-center ${activeTab === 'SALE' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('SALE')}
        >
          <Tag size={18} color={activeTab === 'SALE' ? '#000' : '#666'} className="mr-2" />
          <Text className={`font-bold ${activeTab === 'SALE' ? 'text-foreground' : 'text-muted-foreground'}`}>Chợ Pass Đồ</Text>
        </TouchableOpacity>
      </View>

      {/* Feed List */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-muted-foreground">Chưa có bài viết nào.</Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator className="my-4" /> : null
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
          backgroundColor: '#000',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        // onPress={() => router.push('/community/create')}
      >
        <Plus size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

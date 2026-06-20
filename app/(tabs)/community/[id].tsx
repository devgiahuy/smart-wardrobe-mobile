import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react-native';

import { useGetPostDetails, useGetPostComments, useLikePostMutation, useAddCommentMutation } from '@/features/community/queries/community.queries';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post, isLoading: isPostLoading } = useGetPostDetails(id);
  const { data: comments, isLoading: isCommentsLoading } = useGetPostComments(id);
  
  const [commentText, setCommentText] = useState("");
  const likeMutation = useLikePostMutation();
  const addCommentMutation = useAddCommentMutation();

  const handleLike = () => {
    if (!post) return;
    likeMutation.mutate({ publicId: post.publicId, data: { isLiked: !post.isLiked } });
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || !post) return;
    try {
      await addCommentMutation.mutateAsync({ publicId: post.publicId, data: { content: commentText } });
      setCommentText("");
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể gửi bình luận');
    }
  };

  if (isPostLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text>Không tìm thấy bài viết.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-input">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">Bài viết của {post.username}</Text>
        <TouchableOpacity>
          <MoreHorizontal size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* User Info */}
          <View className="flex-row items-center px-4 py-4 border-b border-input">
            <View className="w-12 h-12 rounded-full bg-muted overflow-hidden mr-3">
              {post.avatarUrl ? (
                <Image source={{ uri: post.avatarUrl }} className="w-full h-full" />
              ) : (
                <View className="flex-1 items-center justify-center bg-primary">
                  <Text className="text-primary-foreground font-bold text-xl">{post.username?.charAt(0).toUpperCase() || 'U'}</Text>
                </View>
              )}
            </View>
            <View className="flex-1">
              <Text className="font-bold text-foreground text-base">{post.username}</Text>
              <Text className="text-sm text-muted-foreground">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</Text>
            </View>
          </View>

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <View className="w-full aspect-[4/5] bg-muted">
              <Image source={{ uri: post.media[0].mediaUrl }} className="w-full h-full" resizeMode="cover" />
            </View>
          )}

          {/* Actions */}
          <View className="flex-row items-center px-4 py-3 border-b border-input">
            <TouchableOpacity onPress={handleLike} className="flex-row items-center mr-6">
              <Heart size={26} color={post.isLiked ? "#EF4444" : "#000"} fill={post.isLiked ? "#EF4444" : "transparent"} />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center mr-6">
              <MessageCircle size={26} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="px-4 py-3 border-b border-input">
            <Text className="font-bold text-foreground mb-2">{post.likeCount} lượt thích</Text>
            <Text className="text-foreground text-[15px] leading-6 mb-2">
              <Text className="font-bold mr-2">{post.username}</Text> {post.title && <Text className="font-bold">[{post.title}] </Text>}{post.content}
            </Text>
            
            {post.postType === 'SALE' && (
              <View className="bg-muted p-4 rounded-xl mt-4">
                <Text className="font-bold text-lg mb-2">Thông tin Pass Đồ</Text>
                <Text className="text-foreground mb-1">Tổng giá: <Text className="font-bold text-primary">{post.totalPrice?.toLocaleString('vi-VN')} đ</Text></Text>
                {post.contactInfo && <Text className="text-foreground mb-1">Liên hệ: {post.contactInfo}</Text>}
                
                <View className="mt-2 space-y-2">
                  {post.items?.map(item => (
                    <View key={item.id} className="flex-row items-center bg-background p-2 rounded-lg">
                      {/* Optional Chaining on item.item since it's generic type from WardrobeItemRes */}
                      {item.item?.imageUrl && (
                        <Image source={{ uri: item.item.imageUrl as string }} className="w-12 h-12 rounded-md mr-3" />
                      )}
                      <View className="flex-1">
                        <Text className="font-medium text-foreground">{(item.item?.category as any)?.name || 'Trang phục'}</Text>
                        <Text className="text-xs text-muted-foreground">Tình trạng: {item.itemCondition}</Text>
                      </View>
                      <Text className="font-bold text-primary">{item.price?.toLocaleString('vi-VN')} đ</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Comments */}
          <View className="px-4 py-4">
            <Text className="font-bold text-lg mb-4">Bình luận ({post.commentCount})</Text>
            {isCommentsLoading ? (
              <ActivityIndicator />
            ) : comments?.length === 0 ? (
              <Text className="text-muted-foreground text-center py-4">Chưa có bình luận nào.</Text>
            ) : (
              comments?.map(comment => (
                <View key={comment.id} className="flex-row mb-4">
                  <View className="w-8 h-8 rounded-full bg-muted overflow-hidden mr-3">
                    {comment.avatarUrl ? (
                      <Image source={{ uri: comment.avatarUrl }} className="w-full h-full" />
                    ) : (
                      <View className="flex-1 items-center justify-center bg-primary">
                        <Text className="text-primary-foreground font-bold text-xs">{comment.username?.charAt(0).toUpperCase() || 'U'}</Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground text-[14px]">
                      <Text className="font-bold mr-2">{comment.username}</Text> {comment.content}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-xs text-muted-foreground mr-4">
                        {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                      </Text>
                      <TouchableOpacity>
                        <Text className="text-xs font-medium text-muted-foreground">Trả lời</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View className="p-4 border-t border-input bg-background flex-row items-center">
          <TextInput
            className="flex-1 bg-muted border border-input rounded-full px-4 py-2.5 text-foreground"
            placeholder="Thêm bình luận..."
            value={commentText}
            onChangeText={setCommentText}
            onSubmitEditing={handleSendComment}
          />
          <TouchableOpacity 
            onPress={handleSendComment} 
            disabled={!commentText.trim() || addCommentMutation.isPending}
            className="ml-2 p-2.5 bg-primary rounded-full disabled:opacity-50"
          >
            {addCommentMutation.isPending ? <ActivityIndicator size="small" color="#FFF" /> : <Send size={20} color="#FFF" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

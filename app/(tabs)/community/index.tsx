import React from "react";
import { View, Text, ScrollView, Pressable, TextInput, Image } from "@/tw";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useGetCommunityPosts } from "@/features/community/queries/community.queries";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { secureStorage } from "@/lib/storage";

export default function CommunityScreen() {
  const { user, logout } = useAuthStore();
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetCommunityPosts();
  const router = useRouter();

  const posts = data?.pages.flatMap((page: any) => page.items) || [];

  const handleLogout = async () => {
    await secureStorage.deleteItemAsync("accessToken");
    await secureStorage.deleteItemAsync("refreshToken");
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "var(--color-surface)" }}>
      {/* Top AppBar */}
      <View className="flex-row justify-between items-center px-5 py-4 bg-surface border-b border-outline-variant">
        <View className="flex-row items-center gap-4">
          <MaterialIcons name="menu" size={24} color="var(--color-primary)" />
          <Text className="font-display-xl text-[32px] tracking-tighter text-primary">CLOSY</Text>
        </View>
        <Pressable onPress={handleLogout} className="w-10 h-10 rounded-full border border-outline overflow-hidden">
          <Image
            source={{ uri: user?.avatarUrl || "https://via.placeholder.com/150" }}
            className="w-full h-full object-cover"
          />
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerClassName="pb-24"
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;
          if (isCloseToBottom && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        scrollEventThrottle={400}
      >
        {/* Feed Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row px-5 py-6 gap-6 bg-surface">
          <Pressable className="border-b-2 border-primary pb-1 mr-6">
            <Text className="font-label-caps text-[12px] text-primary uppercase">FOR YOU</Text>
          </Pressable>
          <Pressable className="border-b-2 border-transparent pb-1 mr-6">
            <Text className="font-label-caps text-[12px] text-secondary uppercase">TRENDING</Text>
          </Pressable>
          <Pressable className="border-b-2 border-transparent pb-1 mr-6">
            <Text className="font-label-caps text-[12px] text-secondary uppercase">CREATORS</Text>
          </Pressable>
          <Pressable className="border-b-2 border-transparent pb-1">
            <Text className="font-label-caps text-[12px] text-secondary uppercase">EVENTS</Text>
          </Pressable>
        </ScrollView>

        {/* Create Post Entry */}
        <View className="px-5 mb-10">
          <View className="bg-surface-container-lowest border border-outline-variant p-4 flex-col gap-4">
            <View className="flex-row gap-4">
              <View className="w-10 h-10 rounded-full border border-outline overflow-hidden flex items-center justify-center">
                <Image
                  source={{ uri: user?.avatarUrl || "https://via.placeholder.com/150" }}
                  className="w-full h-full object-cover"
                />
              </View>
              <TextInput
                className="flex-1 bg-transparent font-body-md text-on-surface p-0"
                placeholder="Share your style..."
                placeholderTextColor="var(--color-secondary)"
                multiline
              />
            </View>
            <View className="flex-row justify-between items-center pt-2 border-t border-outline-variant">
              <View className="flex-row gap-4">
                <Pressable className="flex-row items-center gap-1">
                  <MaterialIcons name="image" size={18} color="var(--color-secondary)" />
                  <Text className="font-label-caps text-[10px] text-secondary">UPLOAD</Text>
                </Pressable>
                <Pressable className="flex-row items-center gap-1">
                  <MaterialIcons name="sell" size={18} color="var(--color-secondary)" />
                  <Text className="font-label-caps text-[10px] text-secondary">TAG</Text>
                </Pressable>
              </View>
              <Pressable className="bg-primary px-6 py-2">
                <Text className="text-white font-label-caps text-[12px]">POST</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Trending Styles Carousel */}
        <View className="mb-12">
          <Text className="px-5 font-label-caps text-[12px] mb-4 tracking-widest text-on-surface-variant uppercase">
            Trending Styles
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-5 gap-3">
            {["#MONOCHROME", "#UTILITYCHIC", "#QUIETLUXURY", "#ARCHIVEFASHION"].map(tag => (
              <View key={tag} className="bg-secondary-container px-3 py-2 mr-3">
                <Text className="text-on-secondary-container font-label-caps text-[10px]">{tag}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Social Feed */}
        <View className="space-y-6">
          {isLoading ? (
            <Text className="text-center mt-10 font-body-md text-primary">Loading feed...</Text>
          ) : isError ? (
            <Text className="text-center text-red-500 mt-10 font-body-md">Failed to load feed</Text>
          ) : posts.length > 0 ? (
            posts.map((post: any) => (
              <View key={post.id} className="bg-surface border-y border-outline-variant p-5">
                <View className="flex-row items-center gap-3 mb-4">
                  <Image source={{ uri: post.avatarUrl || "https://via.placeholder.com/150" }} className="w-10 h-10 rounded-full" />
                  <View>
                    <Text className="font-label-md text-on-surface">{post.firstName} {post.lastName}</Text>
                    <Text className="font-body-sm text-secondary">@{post.username}</Text>
                  </View>
                </View>
                <Text className="font-title-md text-on-surface mb-2">{post.title}</Text>
                <Text className="font-body-md text-on-surface-variant mb-4">{post.content}</Text>
                {post.media?.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                    {post.media.map((m: any) => (
                      <Image key={m.id} source={{ uri: m.mediaUrl }} className="w-72 h-96 rounded-xl mr-4" />
                    ))}
                  </ScrollView>
                )}
                <View className="flex-row items-center gap-6 mt-2 pt-4 border-t border-outline-variant">
                  <Pressable className="flex-row items-center gap-2">
                    <MaterialIcons name={post.isLiked ? "favorite" : "favorite-border"} size={20} color={post.isLiked ? "red" : "var(--color-secondary)"} />
                    <Text className="font-label-sm text-secondary">{post.likeCount}</Text>
                  </Pressable>
                  <Pressable className="flex-row items-center gap-2">
                    <MaterialIcons name="chat-bubble-outline" size={20} color="var(--color-secondary)" />
                    <Text className="font-label-sm text-secondary">{post.commentCount}</Text>
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <View className="items-center justify-center py-10">
              <MaterialIcons name="article" size={48} color="var(--color-outline-variant)" />
              <Text className="font-body-md text-secondary mt-4">No posts to show.</Text>
              <Text className="font-label-sm text-outline mt-1 text-center px-10">
                Follow creators or post your own style to build your feed.
              </Text>
            </View>
          )}
          {isFetchingNextPage && <Text className="text-center text-primary my-4">Loading more...</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

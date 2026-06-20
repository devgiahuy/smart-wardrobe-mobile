import React from "react";
import { View, Text, ScrollView, Pressable, TextInput, Image } from "@/tw";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function WardrobeScreen() {
  // In the future, this will be populated via API
  const items: any[] = [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "var(--color-background)" }}>
      {/* TopAppBar */}
      <View className="flex-row justify-between items-center px-5 py-4 bg-surface border-b border-outline-variant">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="menu" size={24} color="var(--color-primary)" />
        </View>
        <Text className="font-display-xl text-[32px] tracking-tighter text-primary">CLOSY</Text>
        <View className="w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-outline-variant">
          <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            className="w-full h-full object-cover"
          />
        </View>
      </View>

      <ScrollView contentContainerClassName="px-5 pt-8 pb-24" showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View className="mb-8">
          <Text className="font-display-xl text-[48px] uppercase leading-none mb-2 text-on-background">Wardrobe</Text>
          <Text className="font-label-caps text-[12px] text-secondary uppercase tracking-widest">
            Curation of your essentials. Storing {items.length} items.
          </Text>
        </View>

        {/* Search & Filter Controls */}
        <View className="mb-8 space-y-6">
          <View className="flex-row items-center bg-surface-container-low border-b border-outline-variant px-2 py-3 mb-6">
            <MaterialIcons name="search" size={20} color="var(--color-secondary)" style={{ marginRight: 12 }} />
            <TextInput
              className="flex-1 bg-transparent border-none font-label-caps text-[12px] text-primary uppercase"
              placeholder="FIND AN ITEM..."
              placeholderTextColor="var(--color-outline)"
            />
          </View>

          <View className="flex-row items-center justify-between">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4 pb-2">
              <Pressable className="border-b-2 border-primary pb-1 mr-4">
                <Text className="font-label-caps text-[12px] text-primary uppercase">ALL</Text>
              </Pressable>
              <Pressable className="pb-1 mr-4">
                <Text className="font-label-caps text-[12px] text-secondary uppercase">SHIRTS</Text>
              </Pressable>
              <Pressable className="pb-1 mr-4">
                <Text className="font-label-caps text-[12px] text-secondary uppercase">JACKETS</Text>
              </Pressable>
              <Pressable className="pb-1 mr-4">
                <Text className="font-label-caps text-[12px] text-secondary uppercase">PANTS</Text>
              </Pressable>
              <Pressable className="pb-1">
                <Text className="font-label-caps text-[12px] text-secondary uppercase">ACCESSORIES</Text>
              </Pressable>
            </ScrollView>
            <Pressable className="ml-4 p-2 border border-outline-variant rounded-lg">
              <MaterialIcons name="tune" size={20} color="var(--color-secondary)" />
            </Pressable>
          </View>
        </View>

        {/* Bento/Editorial Grid */}
        {items.length > 0 ? (
          <View className="flex-row flex-wrap justify-between">
            {/* Grid will map over items here */}
          </View>
        ) : (
          <View className="items-center justify-center py-20">
            <MaterialIcons name="inventory-2" size={48} color="var(--color-outline-variant)" />
            <Text className="font-body-md text-secondary mt-4">Your wardrobe is empty.</Text>
            <Text className="font-label-sm text-outline mt-1 text-center px-10">
              Tap the + button to add your first item to the closet.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <Pressable className="absolute bottom-24 right-5 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg active:opacity-80">
        <MaterialIcons name="add" size={24} color="var(--color-on-primary)" />
      </Pressable>
    </SafeAreaView>
  );
}

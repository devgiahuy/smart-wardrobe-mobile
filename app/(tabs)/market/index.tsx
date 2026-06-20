import React from "react";
import { View, Text, ScrollView, Pressable, Image } from "@/tw";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function MarketScreen() {
  const items: any[] = []; // No mock data

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "var(--color-surface)" }}>
      {/* Top Navigation Bar */}
      <View className="flex-row justify-between items-center px-5 py-4 bg-surface border-b border-outline-variant">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="menu" size={24} color="var(--color-primary)" />
        </View>
        <Text className="font-display-xl text-[32px] tracking-tighter text-primary">CLOSY</Text>
        <View className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
          <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            className="w-full h-full object-cover"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pt-10 pb-32">
        {/* Hero Section */}
        <View className="mb-12">
          <Text className="font-display-xl text-[48px] uppercase mb-4 text-primary leading-none">Marketplace</Text>
          <Text className="font-body-lg text-secondary leading-relaxed mb-6">
            Discover a curated selection of pre-loved designer pieces. Our marketplace promotes circularity and conscious consumption.
          </Text>
          <Pressable className="bg-primary flex-row items-center justify-center py-4 gap-3">
            <MaterialIcons name="add" size={20} color="var(--color-on-primary)" />
            <Text className="font-label-caps text-[12px] text-on-primary">LIST AN ITEM</Text>
          </Pressable>
        </View>

        {/* Filters */}
        <View className="border-b border-outline-variant mb-12 flex-row justify-between items-end">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-6 pb-3">
            <Pressable className="border-b-2 border-primary pb-3">
              <Text className="font-label-caps text-[12px] text-primary">ALL ITEMS</Text>
            </Pressable>
            <Pressable className="pb-3">
              <Text className="font-label-caps text-[12px] text-secondary">OUTERWEAR</Text>
            </Pressable>
            <Pressable className="pb-3">
              <Text className="font-label-caps text-[12px] text-secondary">KNITWEAR</Text>
            </Pressable>
            <Pressable className="pb-3">
              <Text className="font-label-caps text-[12px] text-secondary">ACCESSORIES</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Marketplace Grid */}
        <View className="flex-row flex-wrap justify-between">
          {items.length > 0 ? (
            items.map((item, i) => <View key={i} />)
          ) : (
            <View className="items-center justify-center py-20 w-full">
              <MaterialIcons name="storefront" size={48} color="var(--color-outline-variant)" />
              <Text className="font-body-md text-secondary mt-4">Marketplace is empty.</Text>
              <Text className="font-label-sm text-outline mt-1 text-center px-10">
                Be the first to list a pre-loved designer piece.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

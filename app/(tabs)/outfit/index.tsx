import React from "react";
import { View, Text, ScrollView, Pressable, Image } from "@/tw";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function OutfitScreen() {
  const router = useRouter();
  const curations: any[] = []; // No mock data

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "var(--color-background)" }}>
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
        {/* Header Section */}
        <View className="mb-12">
          <Text className="font-headline-md text-[32px] mb-4 text-on-background">Curations</Text>
          <Text className="font-label-caps text-[12px] text-secondary tracking-widest uppercase">
            Your personal style archive. Currently storing {curations.length} curated looks.
          </Text>
        </View>

        {/* Action Bar */}
        <View className="flex-row gap-2 mb-10">
          <Pressable 
            className="flex-1 flex-row items-center justify-center gap-2 border border-primary py-3 active:bg-surface-container"
          >
            <MaterialIcons name="auto-awesome" size={16} color="var(--color-primary)" />
            <Text className="font-label-caps text-[12px] text-primary">CREATE WITH AI</Text>
          </Pressable>
          <Pressable 
            onPress={() => router.push("/outfits/create")}
            className="flex-1 flex-row items-center justify-center gap-2 bg-primary py-3 active:opacity-80"
          >
            <MaterialIcons name="add" size={16} color="var(--color-on-primary)" />
            <Text className="font-label-caps text-[12px] text-on-primary">CREATE MANUALLY</Text>
          </Pressable>
        </View>

        {/* Filters & Sorting */}
        <View className="border-b border-outline-variant mb-12 flex-row justify-between items-end">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-6 pb-3">
            <Pressable className="border-b-2 border-primary pb-3">
              <Text className="font-label-caps text-[12px] text-primary">ALL</Text>
            </Pressable>
            <Pressable className="pb-3">
              <Text className="font-label-caps text-[12px] text-secondary">AI GENERATED</Text>
            </Pressable>
            <Pressable className="pb-3">
              <Text className="font-label-caps text-[12px] text-secondary">MANUAL</Text>
            </Pressable>
            <Pressable className="pb-3">
              <Text className="font-label-caps text-[12px] text-secondary">SAVED</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Curation Grid */}
        <View className="flex-row flex-wrap justify-between">
          {curations.length > 0 ? (
            curations.map((c, i) => <View key={i} />)
          ) : (
            <Pressable 
              onPress={() => router.push("/outfits/create")}
              className="w-full aspect-[3/4] border border-dashed border-outline-variant items-center justify-center flex-col gap-4 active:bg-surface-container"
            >
              <MaterialIcons name="add-circle" size={40} color="var(--color-outline)" />
              <Text className="font-label-caps text-[12px] text-secondary">CURATE NEW LOOK</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

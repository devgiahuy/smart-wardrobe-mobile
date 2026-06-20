import React from "react";
import { View, Text, ScrollView, Pressable, TextInput, Image } from "@/tw";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function StylistScreen() {
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

      <View className="flex-1 px-5 pt-8 pb-4">
        {/* Header Section */}
        <View className="mb-8">
          <View className="flex-row items-center gap-2 mb-2">
            <MaterialIcons name="auto-awesome" size={24} color="var(--color-primary)" />
            <Text className="font-display-xl text-[48px] uppercase leading-none text-on-background">AI Stylist</Text>
          </View>
          <Text className="font-label-caps text-[12px] text-secondary tracking-widest uppercase">
            Your personal digital fashion assistant.
          </Text>
        </View>

        {/* Chat Area (Empty State) */}
        <ScrollView className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
          <View className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
            <Text className="font-body-md text-primary leading-relaxed">
              Hello. I am your AI stylist. Tell me what you're dressing for today, or ask me to curate an outfit from your wardrobe.
            </Text>
          </View>
          
          <View className="flex-row flex-wrap gap-2 mt-6">
            <Pressable className="border border-outline-variant px-4 py-2 rounded-full">
              <Text className="font-label-sm text-secondary">Workwear</Text>
            </Pressable>
            <Pressable className="border border-outline-variant px-4 py-2 rounded-full">
              <Text className="font-label-sm text-secondary">Date night</Text>
            </Pressable>
            <Pressable className="border border-outline-variant px-4 py-2 rounded-full">
              <Text className="font-label-sm text-secondary">Casual weekend</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Input Area */}
        <View className="flex-row items-center bg-surface-container border border-outline-variant px-4 py-2 rounded-full">
          <TextInput
            className="flex-1 bg-transparent font-body-md text-primary min-h-[40px]"
            placeholder="Ask your stylist..."
            placeholderTextColor="var(--color-secondary)"
          />
          <Pressable className="w-10 h-10 bg-primary rounded-full items-center justify-center">
            <MaterialIcons name="arrow-upward" size={20} color="var(--color-on-primary)" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

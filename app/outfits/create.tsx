import React, { useState } from "react";
import { View, Text, Image, Pressable } from "@/tw";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

// Draggable Item Component
const DraggableItem = ({ imageUri, zIndex, onSelect, isSelected }: any) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const savedScale = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    // onSelect callback can trigger if we want to show controls overlay
  });

  const composed = Gesture.Simultaneous(panGesture, pinchGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    zIndex,
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[animatedStyle, { position: "absolute", top: 100, left: 100 }]}>
        <Image
          source={{ uri: imageUri }}
          className={`w-32 h-32 object-contain ${isSelected ? "border-2 border-sf-accent" : ""}`}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default function OutfitCanvasScreen() {
  const router = useRouter();
  const [itemsOnCanvas, setItemsOnCanvas] = useState<any[]>([]);

  const addToCanvas = (uri: string) => {
    setItemsOnCanvas([...itemsOnCanvas, { id: Date.now().toString(), uri, zIndex: itemsOnCanvas.length }]);
  };

  const sampleWardrobe = [
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&q=80",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&q=80",
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "var(--color-sf-bg-2)" }}>
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-sf-bg z-10">
        <Pressable onPress={() => router.back()}>
          <Text className="text-sf-text font-serif text-lg">Close</Text>
        </Pressable>
        <Text className="text-sf-text font-serif text-xl tracking-wider uppercase">Canvas</Text>
        <Pressable>
          <Text className="text-sf-accent font-serif text-lg">Save</Text>
        </Pressable>
      </View>

      {/* Canvas Area */}
      <View className="flex-1 overflow-hidden relative">
        {itemsOnCanvas.length === 0 && (
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-sf-text-2 font-serif text-xl opacity-50">Drag items here</Text>
          </View>
        )}
        {itemsOnCanvas.map((item) => (
          <DraggableItem key={item.id} imageUri={item.uri} zIndex={item.zIndex} />
        ))}
      </View>

      {/* Drawer */}
      <View className="h-40 bg-sf-bg border-t border-sf-bg-2 px-6 pt-4 pb-8 flex-row gap-4 items-center">
        {sampleWardrobe.map((uri, idx) => (
          <Pressable key={idx} onPress={() => addToCanvas(uri)} className="w-20 h-24 bg-sf-bg-2 rounded-lg overflow-hidden">
            <Image source={{ uri }} className="w-full h-full object-cover" />
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

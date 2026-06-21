import React, { useState, useRef, useMemo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import BottomSheet, { BottomSheetFlatList, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { CanvasItem } from '../../../src/features/outfits/components/CanvasItem';
import { OutfitItemRes } from '../../../src/features/outfits/types';
import { useMyWardrobeItems } from '../../../src/features/wardrobe/queries/wardrobe.queries';
import { WardrobeItemRes } from '../../../src/features/wardrobe/types';
import { View, Text, Pressable } from '../../../src/tw';
import { Image } from '../../../src/tw/image';

export default function OutfitsScreen() {
  const [items, setItems] = useState<OutfitItemRes[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const { data: wardrobeItems } = useMyWardrobeItems();

  const handleUpdatePosition = useCallback((id: string, x: number, y: number, scale: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, position_x: x, position_y: y, scale } : item))
    );
  }, []);

  const handleAddWardrobeItem = (wardrobeItem: WardrobeItemRes) => {
    const newItem: OutfitItemRes = {
      id: Math.random().toString(),
      wardrobe_item: wardrobeItem,
      position_x: 100, // starting position
      position_y: 100,
      scale: 1,
      layer_order: items.length + 1,
    };
    setItems((prev) => [...prev, newItem]);
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.3} />
    ),
    []
  );

  return (
    <View className="flex-1 bg-surface-container-low">
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4 bg-background">
        <Text className="font-display-xl text-2xl text-on-background">Phối Đồ</Text>
        <Pressable className="bg-primary px-4 py-2 rounded-full">
          <Text className="text-on-primary font-label-sm">Lưu Outfit</Text>
        </Pressable>
      </View>

      {/* Canvas Area */}
      <View className="flex-1 relative overflow-hidden">
        {items.map((item) => (
          <CanvasItem key={item.id} item={item} onUpdatePosition={handleUpdatePosition} />
        ))}
      </View>

      {/* FAB */}
      <Pressable
        onPress={() => bottomSheetRef.current?.expand()}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
      >
        <Plus color="#ffffff" size={28} />
      </Pressable>

      {/* Bottom Sheet for Wardrobe Selection */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: '#ffffff' }}
      >
        <View className="px-4 pb-2">
          <Text className="font-headline-md text-lg text-on-surface">Chọn trang phục</Text>
        </View>
        <BottomSheetFlatList
          data={wardrobeItems || []}
          keyExtractor={(i) => i.id}
          numColumns={3}
          contentContainerStyle={{ padding: 8, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleAddWardrobeItem(item)}
              className="flex-1 m-1 aspect-square bg-surface-container rounded-xl overflow-hidden border border-outline-variant"
            >
              <Image source={item.imageUrl} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            </Pressable>
          )}
        />
      </BottomSheet>
    </View>
  );
}

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Save, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import ViewShot, { captureRef } from 'react-native-view-shot';

// Mock data
const MOCK_ITEMS = [
  { id: '1', url: 'https://cdn-icons-png.flaticon.com/512/863/863684.png', name: 'T-Shirt' },
  { id: '2', url: 'https://cdn-icons-png.flaticon.com/512/2806/2806045.png', name: 'Jeans' },
  { id: '3', url: 'https://cdn-icons-png.flaticon.com/512/3345/3345600.png', name: 'Sneakers' },
  { id: '4', url: 'https://cdn-icons-png.flaticon.com/512/2784/2784554.png', name: 'Jacket' },
];

interface CanvasItemType {
  id: string;
  itemId: string;
  url: string;
}

const DraggableItem = ({ item, onRemove }: { item: CanvasItemType, onRemove: (id: string) => void }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  // Pan Gesture (Drag)
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Pinch Gesture (Zoom)
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  // Rotation Gesture
  const rotationGesture = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  // Combine gestures simultaneously
  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture, rotationGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotation.value}rad` },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.draggableBox, animatedStyle]}>
        <Image source={{ uri: item.url }} style={styles.image} resizeMode="contain" />
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => onRemove(item.id)}
        >
          <X size={16} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

export default function CreateOutfitCanvas() {
  const [canvasItems, setCanvasItems] = useState<CanvasItemType[]>([]);
  const canvasRef = useRef<View>(null);

  const addItemToCanvas = (mockItem: typeof MOCK_ITEMS[0]) => {
    setCanvasItems(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        itemId: mockItem.id,
        url: mockItem.url,
      }
    ]);
  };

  const removeItem = (id: string) => {
    setCanvasItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = async () => {
    if (canvasItems.length === 0) {
      Alert.alert('Cảnh báo', 'Vui lòng thêm ít nhất 1 món đồ vào khung vẽ.');
      return;
    }
    
    try {
      Alert.prompt(
        'Lưu Bộ Phối',
        'Nhập tên cho bộ phối này:',
        [
          { text: 'Hủy', style: 'cancel' },
          { 
            text: 'Lưu', 
            onPress: async (name) => {
              if (!name) return;
              
              try {
                // 1. Capture canvas
                const uri = await captureRef(canvasRef, { format: 'png', quality: 1 });
                
                // 2. Upload to Cloudinary (Mocking or real if possible)
                // For a true POC, we can just log or show success, but let's assume we use the actual API:
                /*
                const signatureResult = await wardrobeApi.getUploadSignature();
                const cloudinaryResult = await uploadToCloudinary({
                  fileUri: uri,
                  signatureParams: {
                    apiKey: signatureResult.apiKey,
                    timestamp: signatureResult.timestamp,
                    signature: signatureResult.signature,
                    folder: signatureResult.folder,
                  }
                });
                
                // 3. Save Outfit
                await outfitsApi.createOutfit({
                  name,
                  coverImageUrl: cloudinaryResult.secure_url,
                  coverPublicId: cloudinaryResult.public_id,
                  items: canvasItems.map((item, index) => ({
                    wardrobeItemId: item.itemId,
                    positionX: 0, // Mock positions for now
                    positionY: 0,
                    scale: 1,
                    layerOrder: index,
                    rotation: 0
                  }))
                });
                */

                Alert.alert('Thành công', `Đã lưu bộ phối "${name}".\n(Ảnh capture: ${uri})`, [
                  { text: 'Xong', onPress: () => router.back() }
                ]);
              } catch (error: any) {
                Alert.alert('Lỗi', 'Không thể lưu ảnh bộ phối.');
              }
            } 
          }
        ],
        'plain-text'
      );
    } catch (error) {
      console.error('Capture error', error);
      Alert.alert('Lỗi', 'Không thể lưu ảnh khung vẽ.');
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Phối Đồ (POC)</Text>
          <TouchableOpacity onPress={handleSave}>
            <Save size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Canvas Area */}
        <View style={styles.canvasContainer}>
          <ViewShot ref={canvasRef} style={styles.canvas} options={{ format: 'png', quality: 1.0 }}>
            {canvasItems.length === 0 && (
              <Text style={styles.emptyText}>Chạm vào các món đồ bên dưới để thêm vào khung vẽ</Text>
            )}
            {canvasItems.map(item => (
              <DraggableItem key={item.id} item={item} onRemove={removeItem} />
            ))}
          </ViewShot>
        </View>

        {/* Bottom Drawer for Items */}
        <View style={styles.bottomDrawer}>
          <Text style={styles.drawerTitle}>Tủ đồ của bạn</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            {MOCK_ITEMS.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.mockItem}
                onPress={() => addItemToCanvas(item)}
              >
                <Image source={{ uri: item.url }} style={styles.mockImage} resizeMode="contain" />
                <Text style={styles.mockText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    padding: 16,
  },
  canvas: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  emptyText: {
    color: '#999',
    position: 'absolute',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  draggableBox: {
    position: 'absolute',
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 4,
  },
  bottomDrawer: {
    height: 160,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  scrollView: {
    flexDirection: 'row',
  },
  mockItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  mockImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  mockText: {
    fontSize: 12,
    color: '#333',
  },
});

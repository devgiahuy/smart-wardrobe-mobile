import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import { Image } from '../../../tw/image';
import { OutfitItemRes } from '../types';

interface Props {
  item: OutfitItemRes;
  onUpdatePosition: (id: string, x: number, y: number, scale: number) => void;
}

export const CanvasItem: React.FC<Props> = ({ item, onUpdatePosition }) => {
  const isInteracting = useSharedValue(false);
  
  const translateX = useSharedValue(item.position_x || 0);
  const translateY = useSharedValue(item.position_y || 0);
  const scale = useSharedValue(item.scale || 1);

  const savedTranslateX = useSharedValue(item.position_x || 0);
  const savedTranslateY = useSharedValue(item.position_y || 0);
  const savedScale = useSharedValue(item.scale || 1);

  const notifyUpdate = () => {
    onUpdatePosition(item.id, translateX.value, translateY.value, scale.value);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isInteracting.value = true;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      isInteracting.value = false;
      runOnJS(notifyUpdate)();
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      isInteracting.value = true;
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      isInteracting.value = false;
      runOnJS(notifyUpdate)();
    });

  const composed = Gesture.Simultaneous(panGesture, pinchGesture);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    zIndex: isInteracting.value ? 100 : item.layer_order,
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[style, { width: 150, height: 150 }]}>
        <Image
          source={item.wardrobe_item?.imageUrl}
          style={{ width: '100%', height: '100%', borderRadius: 8 }}
          contentFit="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
};

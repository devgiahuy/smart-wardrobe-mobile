import React from 'react';
import { WardrobeItemRes } from '../types';
import { Heart } from 'lucide-react-native';
import { View, Text, Pressable } from '../../../tw';
import { Image } from '../../../tw/image';

interface Props {
  item: WardrobeItemRes;
  onPress: () => void;
}

export const WardrobeCard: React.FC<Props> = ({ item, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 m-1 overflow-hidden bg-surface rounded-xl shadow-sm border border-outline-variant"
    >
      <View className="relative w-full aspect-square bg-surface-container-low">
        <Image
          source={item.imageUrl}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={200}
        />
        {item.isFavorite && (
          <View className="absolute top-2 right-2 bg-surface/80 rounded-full p-1">
            <Heart size={16} color="red" fill="red" />
          </View>
        )}
      </View>
      <View className="p-2">
        <Text className="font-body-md text-on-surface truncate" numberOfLines={1}>
          {item.brand || 'No Brand'}
        </Text>
        <Text className="font-label-sm text-secondary truncate" numberOfLines={1}>
          {item.color || 'Unknown Color'}
        </Text>
      </View>
    </Pressable>
  );
};

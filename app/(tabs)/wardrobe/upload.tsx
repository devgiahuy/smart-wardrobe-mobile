import React, { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import { useBatchUploadWardrobeItems } from '../../../src/features/wardrobe/queries/wardrobe.queries';
import { View, Text, Pressable } from '../../../src/tw';
import { Image } from '../../../src/tw/image';

export default function UploadScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const uploadMutation = useBatchUploadWardrobeItems();

  const handleTakePhotos = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Cấp quyền', 'Bạn cần cấp quyền sử dụng camera để chụp ảnh.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Cấp quyền', 'Bạn cần cấp quyền truy cập thư viện ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = () => {
    if (!imageUri) return;
    
    // NOTE: In a real app, you would first upload the image to S3/Cloudinary
    // to get a remote URL, then pass it to batchUploadWardrobeItems.
    // For this boilerplate, we'll simulate the mutation.
    uploadMutation.mutate({ imageUrls: [imageUri] }, {
      onSuccess: () => {
        Alert.alert('Thành công', 'Đã thêm trang phục vào tủ đồ!');
        router.back();
      },
      onError: (err) => {
        Alert.alert('Lỗi', 'Không thể tải lên lúc này.');
        console.error(err);
      }
    });
  };

  return (
    <View className="flex-1 bg-background p-4">
      {imageUri ? (
        <View className="flex-1 items-center justify-center">
          <View className="relative w-full aspect-[3/4] bg-surface-container rounded-2xl overflow-hidden border border-outline-variant">
            <Image
              source={imageUri}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
            <Pressable
              onPress={() => setImageUri(null)}
              className="absolute top-4 right-4 bg-surface/80 p-2 rounded-full"
            >
              <X color="#000000" size={24} />
            </Pressable>
          </View>

          <Pressable
            onPress={handleUpload}
            disabled={uploadMutation.isPending}
            className={`mt-8 w-full py-4 rounded-xl flex-row justify-center items-center ${
              uploadMutation.isPending ? 'bg-secondary' : 'bg-primary'
            }`}
          >
            {uploadMutation.isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-on-primary font-headline-md text-lg">Xác nhận Tải Lên</Text>
            )}
          </Pressable>
        </View>
      ) : (
        <View className="flex-1 justify-center gap-6 px-4">
          <Pressable
            onPress={handleTakePhotos}
            className="bg-surface-container p-6 rounded-2xl items-center border border-outline-variant active:bg-surface-container-low"
          >
            <Camera color="#000000" size={48} className="mb-4" />
            <Text className="font-headline-md text-lg text-on-surface">Chụp Ảnh Mới</Text>
            <Text className="font-body-md text-secondary text-center mt-2">
              Sử dụng camera để chụp trực tiếp trang phục của bạn
            </Text>
          </Pressable>

          <Pressable
            onPress={handlePickImage}
            className="bg-surface-container p-6 rounded-2xl items-center border border-outline-variant active:bg-surface-container-low"
          >
            <ImageIcon color="#000000" size={48} className="mb-4" />
            <Text className="font-headline-md text-lg text-on-surface">Chọn từ Thư Viện</Text>
            <Text className="font-body-md text-secondary text-center mt-2">
              Tải lên ảnh có sẵn từ điện thoại
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

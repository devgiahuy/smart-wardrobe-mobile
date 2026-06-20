import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Image as ImageIcon, X, ChevronLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { router } from 'expo-router';

import { Button } from '@/components/ui/button';
import { useGetCategories, useBatchUploadWardrobeItemsMutation } from '@/features/wardrobe/queries/wardrobe.queries';
import { wardrobeApi } from '@/features/wardrobe/api/wardrobe.api';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function WardrobeUploadScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: categoriesData } = useGetCategories();
  const batchUploadMutation = useBatchUploadWardrobeItemsMutation();
  const categories = categoriesData || [];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Fix mediaTypes error (it's an array of types in latest Expo)
      allowsEditing: true,
      quality: 1, // Start with high quality, then manipulate
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      await processImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Ứng dụng cần quyền sử dụng camera để chụp ảnh.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      await processImage(result.assets[0].uri);
    }
  };

  const processImage = async (uri: string) => {
    try {
      // Compress and resize image
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1080 } }], // Resize width to 1080px (maintaining aspect ratio)
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG } // 80% quality JPEG
      );
      setImageUri(manipResult.uri);
    } catch (error) {
      console.error('Image processing error:', error);
      Alert.alert('Lỗi', 'Không thể xử lý ảnh.');
    }
  };

  const handleUpload = async () => {
    if (!imageUri) {
      Alert.alert('Lỗi', 'Vui lòng chọn ảnh trước.');
      return;
    }
    if (!selectedCategoryId) {
      Alert.alert('Lỗi', 'Vui lòng chọn danh mục.');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Get Signature
      const signatureResult = await wardrobeApi.getUploadSignature();

      // 2. Upload to Cloudinary
      const cloudinaryResult = await uploadToCloudinary({
        fileUri: imageUri,
        signatureParams: {
          apiKey: signatureResult.apiKey,
          timestamp: signatureResult.timestamp,
          signature: signatureResult.signature,
          folder: signatureResult.folder,
          publicId: signatureResult.publicId,
        }
      });

      // 3. Batch Upload to backend
      await batchUploadMutation.mutateAsync({
        items: [
          {
            categoryId: selectedCategoryId,
            imagePublicId: cloudinaryResult.public_id,
            imageUrl: cloudinaryResult.secure_url,
          }
        ]
      });

      Alert.alert('Thành công', 'Đã thêm trang phục vào tủ đồ.', [
        { text: 'Xong', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tải lên.';
      Alert.alert('Lỗi', message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-input">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">Thêm trang phục</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {/* Image Preview / Picker */}
        <View className="items-center justify-center mb-8">
          {imageUri ? (
            <View className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted">
              <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
              <TouchableOpacity 
                className="absolute top-4 right-4 bg-black/50 p-2 rounded-full"
                onPress={() => setImageUri(null)}
              >
                <X size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="w-full aspect-square rounded-2xl border-2 border-dashed border-input items-center justify-center bg-muted/50 p-6">
              <TouchableOpacity onPress={pickImage} className="items-center mb-6 w-full">
                <View className="bg-primary/10 p-4 rounded-full mb-2">
                  <ImageIcon size={32} color="#000" />
                </View>
                <Text className="text-foreground font-medium">Chọn từ thư viện</Text>
              </TouchableOpacity>

              <Text className="text-muted-foreground mb-6 font-bold">HOẶC</Text>

              <TouchableOpacity onPress={takePhoto} className="items-center w-full">
                <View className="bg-primary/10 p-4 rounded-full mb-2">
                  <Camera size={32} color="#000" />
                </View>
                <Text className="text-foreground font-medium">Chụp ảnh mới</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Category Selection */}
        {imageUri && (
          <View>
            <Text className="text-lg font-bold text-foreground mb-4">Chọn danh mục</Text>
            <View className="flex-row flex-wrap gap-2">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategoryId(category.id)}
                  className={`px-4 py-2 rounded-full border ${selectedCategoryId === category.id ? 'bg-primary border-primary' : 'bg-background border-input'}`}
                >
                  <Text className={selectedCategoryId === category.id ? 'text-primary-foreground font-medium' : 'text-foreground'}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Upload Button */}
      {imageUri && (
        <View className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t border-input">
          <Button 
            onPress={handleUpload} 
            disabled={isUploading || !selectedCategoryId}
            className="w-full flex-row justify-center items-center"
          >
            {isUploading ? <ActivityIndicator color="#FFF" className="mr-2" /> : null}
            <Text className="text-primary-foreground font-medium">{isUploading ? 'Đang lưu...' : 'Thêm vào Tủ đồ'}</Text>
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

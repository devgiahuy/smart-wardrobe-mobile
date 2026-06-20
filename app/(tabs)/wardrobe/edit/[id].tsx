import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGetWardrobeItemDetail, useUpdateWardrobeItemMutation, useGetCategories } from '@/features/wardrobe/queries/wardrobe.queries';
import { UpdateWardrobeItemReq } from '@/features/wardrobe/types';

export default function EditWardrobeItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: item, isLoading, isError } = useGetWardrobeItemDetail(id);
  const { data: categoriesData } = useGetCategories();
  const updateMutation = useUpdateWardrobeItemMutation();

  const { control, handleSubmit, reset } = useForm<UpdateWardrobeItemReq>({
    defaultValues: {
      categoryId: '',
      color: '',
      fit: '',
      material: '',
      pattern: '',
      seasonality: '',
      style: '',
      price: undefined,
    }
  });

  useEffect(() => {
    if (item) {
      reset({
        categoryId: item.category?.id || '',
        color: item.color || '',
        fit: item.fit || '',
        material: item.material || '',
        pattern: item.pattern || '',
        seasonality: item.seasonality || '',
        style: item.style || '',
        price: item.price,
      });
    }
  }, [item, reset]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !item) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text>Không tìm thấy trang phục.</Text>
      </View>
    );
  }

  const onSubmit = async (data: UpdateWardrobeItemReq) => {
    try {
      await updateMutation.mutateAsync({ id, data: { ...data, price: data.price ? Number(data.price) : undefined } });
      Alert.alert('Thành công', 'Đã cập nhật thông tin trang phục.');
      router.back();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Cập nhật thất bại';
      Alert.alert('Lỗi', message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 border-b border-input">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">Sửa thông tin</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium mb-1">Màu sắc</Text>
            <Controller
              control={control}
              name="color"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input placeholder="Vd: Đen, Trắng..." onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Kiểu dáng (Fit)</Text>
            <Controller
              control={control}
              name="fit"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input placeholder="Vd: Regular, Slim..." onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Chất liệu</Text>
            <Controller
              control={control}
              name="material"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input placeholder="Vd: Cotton, Denim..." onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Họa tiết</Text>
            <Controller
              control={control}
              name="pattern"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input placeholder="Vd: Trơn, Kẻ sọc..." onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Mùa (Seasonality)</Text>
            <Controller
              control={control}
              name="seasonality"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input placeholder="Vd: Mùa hè, Thu đông..." onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Phong cách</Text>
            <Controller
              control={control}
              name="style"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input placeholder="Vd: Casual, Vintage..." onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Giá (VNĐ)</Text>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input 
                  placeholder="Nhập giá" 
                  onBlur={onBlur} 
                  onChangeText={onChange} 
                  value={value?.toString() || ''} 
                  keyboardType="numeric"
                />
              )}
            />
          </View>

          <Button 
            onPress={handleSubmit(onSubmit)} 
            className="w-full mt-6"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

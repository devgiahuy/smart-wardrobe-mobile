import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Save } from 'lucide-react-native';

import { useAuthStore } from '@/store/useAuthStore';
import { useUpdateProfileMutation } from '@/features/profile/queries/profile.queries';
import { Gender } from '@/features/auth/types';

export default function EditProfileScreen() {
  const { user } = useAuthStore();
  const updateMutation = useUpdateProfileMutation();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [address, setAddress] = useState(user?.address || '');
  const [gender, setGender] = useState<Gender>(user?.gender || Gender.OTHER);
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth?.split('T')[0] || '');

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập Tên.');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        firstName,
        lastName,
        address,
        gender,
        dateOfBirth: dateOfBirth || undefined,
      });
      Alert.alert('Thành công', 'Đã cập nhật thông tin thành công.');
      router.back();
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-input">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">Chỉnh sửa hồ sơ</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView className="p-6">
          <View className="mb-4">
            <Text className="font-bold mb-2 text-foreground">Họ</Text>
            <TextInput
              className="bg-muted border border-input p-3 rounded-lg text-foreground"
              value={lastName}
              onChangeText={setLastName}
              placeholder="VD: Nguyễn"
            />
          </View>
          
          <View className="mb-4">
            <Text className="font-bold mb-2 text-foreground">Tên</Text>
            <TextInput
              className="bg-muted border border-input p-3 rounded-lg text-foreground"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="VD: Văn A"
            />
          </View>

          <View className="mb-4">
            <Text className="font-bold mb-2 text-foreground">Địa chỉ</Text>
            <TextInput
              className="bg-muted border border-input p-3 rounded-lg text-foreground"
              value={address}
              onChangeText={setAddress}
              placeholder="Nhập địa chỉ của bạn"
            />
          </View>

          <View className="mb-4">
            <Text className="font-bold mb-2 text-foreground">Ngày sinh (YYYY-MM-DD)</Text>
            <TextInput
              className="bg-muted border border-input p-3 rounded-lg text-foreground"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="1990-01-01"
            />
          </View>

          <View className="mb-6">
            <Text className="font-bold mb-2 text-foreground">Giới tính</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className={`flex-1 py-3 items-center rounded border ${gender === Gender.MALE ? 'bg-primary border-primary' : 'bg-background border-input'}`}
                onPress={() => setGender(Gender.MALE)}
              >
                <Text className={`font-bold ${gender === Gender.MALE ? 'text-primary-foreground' : 'text-foreground'}`}>Nam</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 items-center rounded border ${gender === Gender.FEMALE ? 'bg-primary border-primary' : 'bg-background border-input'}`}
                onPress={() => setGender(Gender.FEMALE)}
              >
                <Text className={`font-bold ${gender === Gender.FEMALE ? 'text-primary-foreground' : 'text-foreground'}`}>Nữ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 items-center rounded border ${gender === Gender.OTHER ? 'bg-primary border-primary' : 'bg-background border-input'}`}
                onPress={() => setGender(Gender.OTHER)}
              >
                <Text className={`font-bold ${gender === Gender.OTHER ? 'text-primary-foreground' : 'text-foreground'}`}>Khác</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={updateMutation.isPending}
            className="w-full bg-primary py-4 rounded-xl flex-row justify-center items-center mb-8"
          >
            {updateMutation.isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Save size={20} color="#FFF" className="mr-2" />
                <Text className="text-primary-foreground font-bold text-lg">Lưu Thay Đổi</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

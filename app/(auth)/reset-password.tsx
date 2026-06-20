import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, KeyRound } from 'lucide-react-native';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { resetPasswordSchema, ResetPasswordFormData } from '@/features/auth/schemas/auth.schema';
import { useResetPasswordMutation } from '@/features/auth/queries/auth.queries';
import { secureStorage } from '@/lib/storage';

export default function ResetPasswordScreen() {
  const { email, otpCode } = useLocalSearchParams<{ email: string; otpCode: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const resetPasswordMutation = useResetPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      logoutAllDevices: true,
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPasswordMutation.mutateAsync({
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
        logoutAllDevices: data.logoutAllDevices,
      });
      
      // Cleanup tokens if logoutAllDevices
      if (data.logoutAllDevices) {
        await secureStorage.deleteItemAsync('accessToken');
        await secureStorage.deleteItemAsync('refreshToken');
      }

      Alert.alert('Thành công', 'Mật khẩu đã được đặt lại.', [
        { text: 'Đăng nhập', onPress: () => router.replace('/(auth)/login') }
      ]);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Lỗi đặt lại mật khẩu';
      Alert.alert('Lỗi', message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 p-6">
        <View className="items-center mb-10 mt-6">
          <View className="bg-primary/10 p-4 rounded-full mb-4">
            <KeyRound size={48} color="#000" className="text-primary" />
          </View>
          <Text className="text-2xl font-bold text-foreground tracking-tight">Đặt lại mật khẩu</Text>
        </View>

        <View className="space-y-4">
          <View>
            <View className="relative justify-center">
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Mật khẩu mới"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showPassword}
                    className={`pr-12 ${errors.newPassword ? 'border-destructive' : ''}`}
                  />
                )}
              />
              <TouchableOpacity 
                className="absolute right-3 top-3 h-6 w-6 items-center justify-center"
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
              </TouchableOpacity>
            </View>
            {errors.newPassword && <Text className="text-destructive text-sm mt-1">{errors.newPassword.message}</Text>}
          </View>

          <View>
            <View className="relative justify-center">
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Xác nhận mật khẩu mới"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showConfirmPassword}
                    className={`pr-12 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                  />
                )}
              />
              <TouchableOpacity 
                className="absolute right-3 top-3 h-6 w-6 items-center justify-center"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text className="text-destructive text-sm mt-1">{errors.confirmPassword.message}</Text>}
          </View>

          <Button 
            onPress={handleSubmit(onSubmit)} 
            className="w-full mt-6"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? 'Đang xử lý...' : 'Lưu mật khẩu mới'}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

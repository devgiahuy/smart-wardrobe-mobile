import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ShieldQuestion } from 'lucide-react-native';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/features/auth/schemas/auth.schema';
import { useForgotPasswordMutation } from '@/features/auth/queries/auth.queries';

export default function ForgotPasswordScreen() {
  const forgotPasswordMutation = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      Alert.alert('Thành công', 'OTP đã được gửi đến email của bạn.', [
        { text: 'OK', onPress: () => router.push(`/(auth)/confirm-otp?email=${encodeURIComponent(data.email)}&type=forgot-password`) }
      ]);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Yêu cầu thất bại';
      Alert.alert('Lỗi', message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 p-6">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ChevronLeft size={28} color="#000" className="text-foreground" />
          </TouchableOpacity>
        </View>

        <View className="items-center mb-10">
          <View className="bg-primary/10 p-4 rounded-full mb-4">
            <ShieldQuestion size={48} color="#000" className="text-primary" />
          </View>
          <Text className="text-2xl font-bold text-foreground tracking-tight">Quên mật khẩu</Text>
          <Text className="text-muted-foreground text-center mt-2 px-4">
            Nhập email của bạn, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className={errors.email ? 'border-destructive' : ''}
                />
              )}
            />
            {errors.email && (
              <Text className="text-destructive text-sm mt-1">{errors.email.message}</Text>
            )}
          </View>

          <Button 
            onPress={handleSubmit(onSubmit)} 
            className="w-full mt-4"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? 'Đang gửi...' : 'Gửi mã OTP'}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

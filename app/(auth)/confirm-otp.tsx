import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MailOpen } from 'lucide-react-native';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { confirmOtpSchema, ConfirmOtpFormData } from '@/features/auth/schemas/auth.schema';
import { useConfirmRegisterOtpMutation, useConfirmForgotPasswordOtpMutation } from '@/features/auth/queries/auth.queries';
import { secureStorage } from '@/lib/storage';

export default function ConfirmOtpScreen() {
  const { email, type = 'register' } = useLocalSearchParams<{ email: string; type: string }>();
  const confirmRegisterOtpMutation = useConfirmRegisterOtpMutation();
  const confirmForgotPasswordOtpMutation = useConfirmForgotPasswordOtpMutation();

  const isPending = confirmRegisterOtpMutation.isPending || confirmForgotPasswordOtpMutation.isPending;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmOtpFormData>({
    resolver: zodResolver(confirmOtpSchema),
    defaultValues: {
      otpCode: '',
    },
  });

  const onSubmit = async (data: ConfirmOtpFormData) => {
    try {
      if (type === 'register') {
        await confirmRegisterOtpMutation.mutateAsync({ email: email || '', otpCode: data.otpCode });
        Alert.alert('Thành công', 'Xác thực thành công. Bạn có thể đăng nhập ngay bây giờ.', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') }
        ]);
      } else {
        const res: any = await confirmForgotPasswordOtpMutation.mutateAsync({ email: email || '', otpCode: data.otpCode });
        if (res && res.accessToken) {
          await secureStorage.setItemAsync('accessToken', res.accessToken);
        }
        Alert.alert('Thành công', 'Xác thực OTP thành công.', [
          { text: 'OK', onPress: () => router.push(`/(auth)/reset-password?email=${encodeURIComponent(email || '')}&otpCode=${encodeURIComponent(data.otpCode)}`) }
        ]);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Xác thực thất bại';
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
            <MailOpen size={48} color="#000" className="text-primary" />
          </View>
          <Text className="text-2xl font-bold text-foreground tracking-tight text-center">Xác thực Email</Text>
          <Text className="text-muted-foreground text-center mt-2 px-4">
            Vui lòng nhập mã OTP gồm 6 chữ số đã được gửi đến email {email}
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Controller
              control={control}
              name="otpCode"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Nhập mã OTP (VD: 123456)"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="number-pad"
                  maxLength={6}
                  className={`text-center text-xl tracking-[10px] ${errors.otpCode ? 'border-destructive' : ''}`}
                />
              )}
            />
            {errors.otpCode && (
              <Text className="text-destructive text-sm mt-1 text-center">{errors.otpCode.message}</Text>
            )}
          </View>

          <Button 
            onPress={handleSubmit(onSubmit)} 
            className="w-full mt-6"
            disabled={isPending}
          >
            {isPending ? 'Đang xác thực...' : 'Xác thực'}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

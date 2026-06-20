import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Shirt } from 'lucide-react-native';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginSchema, LoginFormData } from '@/features/auth/schemas/auth.schema';
import { useLoginMutation } from '@/features/auth/queries/auth.queries';
import { secureStorage } from '@/lib/storage';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/features/auth/api/auth.api';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLoginMutation();
  const setAuthUser = useAuthStore(state => state.login);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginName: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginMutation.mutateAsync(data);
      await secureStorage.setItemAsync('accessToken', res.accessToken);
      if (res.refreshToken) {
        await secureStorage.setItemAsync('refreshToken', res.refreshToken);
      }
      
      // Fetch user info
      const user = await authApi.getMe();
      setAuthUser(user);

      router.replace('/(tabs)/wardrobe');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Đăng nhập thất bại';
      Alert.alert('Lỗi', message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          <View className="items-center mb-10">
            <View className="bg-primary/10 p-4 rounded-full mb-4">
              <Shirt size={48} color="#000" className="text-primary" />
            </View>
            <Text className="text-3xl font-bold text-foreground tracking-tight">Smart Wardrobe</Text>
            <Text className="text-muted-foreground text-base mt-2">Đăng nhập để quản lý tủ đồ của bạn</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Controller
                control={control}
                name="loginName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Email hoặc tên đăng nhập"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className={errors.loginName ? 'border-destructive' : ''}
                    testID="email-input"
                  />
                )}
              />
              {errors.loginName && (
                <Text className="text-destructive text-sm mt-1">{errors.loginName.message}</Text>
              )}
            </View>

            <View>
              <View className="relative justify-center">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Mật khẩu"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry={!showPassword}
                      className={`pr-12 ${errors.password ? 'border-destructive' : ''}`}
                      testID="password-input"
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
              {errors.password && (
                <Text className="text-destructive text-sm mt-1">{errors.password.message}</Text>
              )}
            </View>

            <View className="items-end">
              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-medium text-sm">Quên mật khẩu?</Text>
                </TouchableOpacity>
              </Link>
            </View>

            <Button 
              onPress={handleSubmit(onSubmit)} 
              className="w-full mt-4"
              disabled={loginMutation.isPending}
              testID="login-button"
            >
              {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </View>

          <View className="flex-row justify-center mt-8 space-x-1">
            <Text className="text-muted-foreground">Chưa có tài khoản?</Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-bold">Đăng ký ngay</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

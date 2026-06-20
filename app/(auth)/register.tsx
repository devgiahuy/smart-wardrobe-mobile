import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerSchema, RegisterFormData } from '@/features/auth/schemas/auth.schema';
import { useRegisterMutation } from '@/features/auth/queries/auth.queries';
import { Gender } from '@/features/auth/types';

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const registerMutation = useRegisterMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: Gender.MALE,
      dateOfBirth: '',
      address: '',
    },
  });

  const genderValue = watch('gender');
  const dateOfBirthValue = watch('dateOfBirth');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      Alert.alert('Thành công', 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực OTP.', [
        { text: 'OK', onPress: () => router.push(`/(auth)/confirm-otp?email=${encodeURIComponent(data.email)}`) }
      ]);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Đăng ký thất bại';
      Alert.alert('Lỗi', message);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setValue('dateOfBirth', formattedDate, { shouldValidate: true });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ChevronLeft size={28} color="#000" className="text-foreground" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground">Tạo tài khoản</Text>
          </View>

          <View className="space-y-4">
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Họ"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className={errors.firstName ? 'border-destructive' : ''}
                    />
                  )}
                />
                {errors.firstName && <Text className="text-destructive text-xs mt-1">{errors.firstName.message}</Text>}
              </View>
              <View className="flex-1">
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Tên đệm và Tên"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className={errors.lastName ? 'border-destructive' : ''}
                    />
                  )}
                />
                {errors.lastName && <Text className="text-destructive text-xs mt-1">{errors.lastName.message}</Text>}
              </View>
            </View>

            <View>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Tên đăng nhập"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    className={errors.username ? 'border-destructive' : ''}
                  />
                )}
              />
              {errors.username && <Text className="text-destructive text-xs mt-1">{errors.username.message}</Text>}
            </View>

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
              {errors.email && <Text className="text-destructive text-xs mt-1">{errors.email.message}</Text>}
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
              {errors.password && <Text className="text-destructive text-xs mt-1">{errors.password.message}</Text>}
            </View>

            <View>
              <View className="relative justify-center">
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Xác nhận mật khẩu"
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
              {errors.confirmPassword && <Text className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</Text>}
            </View>

            <View>
              <Text className="text-sm font-medium mb-2 text-foreground">Giới tính</Text>
              <View className="flex-row space-x-2">
                {[
                  { label: 'Nam', value: Gender.MALE },
                  { label: 'Nữ', value: Gender.FEMALE },
                  { label: 'Khác', value: Gender.OTHER },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => setValue('gender', item.value)}
                    className={`flex-1 py-3 items-center rounded-lg border ${
                      genderValue === item.value 
                        ? 'bg-primary border-primary' 
                        : 'bg-background border-input'
                    }`}
                  >
                    <Text className={genderValue === item.value ? 'text-primary-foreground font-medium' : 'text-foreground'}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text className="text-sm font-medium mb-2 text-foreground">Ngày sinh</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className={`h-12 justify-center px-3 rounded-lg border ${errors.dateOfBirth ? 'border-destructive' : 'border-input'} bg-background`}
              >
                <Text className={dateOfBirthValue ? 'text-foreground' : 'text-muted-foreground'}>
                  {dateOfBirthValue || 'YYYY-MM-DD'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirthValue ? new Date(dateOfBirthValue) : new Date()}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}
              {errors.dateOfBirth && <Text className="text-destructive text-xs mt-1">{errors.dateOfBirth.message}</Text>}
            </View>

            <View>
              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Địa chỉ"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className={errors.address ? 'border-destructive' : ''}
                  />
                )}
              />
              {errors.address && <Text className="text-destructive text-xs mt-1">{errors.address.message}</Text>}
            </View>

            <Button 
              onPress={handleSubmit(onSubmit)} 
              className="w-full mt-6"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Đang xử lý...' : 'Đăng ký'}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

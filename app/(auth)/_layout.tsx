import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="confirm-otp" options={{ title: 'Xác thực OTP', headerBackTitle: 'Trở lại' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Quên mật khẩu', headerBackTitle: 'Trở lại' }} />
      <Stack.Screen name="reset-password" options={{ title: 'Đặt lại mật khẩu', headerBackTitle: 'Trở lại' }} />
    </Stack>
  );
}

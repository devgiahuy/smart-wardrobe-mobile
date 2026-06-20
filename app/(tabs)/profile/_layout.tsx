import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Hồ sơ', headerShown: false }} />
      <Stack.Screen name="edit" options={{ title: 'Chỉnh sửa hồ sơ', headerBackTitle: 'Trở lại' }} />
    </Stack>
  );
}

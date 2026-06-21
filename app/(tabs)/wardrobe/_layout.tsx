import { Stack } from 'expo-router';

export default function WardrobeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Tủ Đồ của tôi', headerShown: true }} />
      <Stack.Screen name="upload" options={{ presentation: 'modal', title: 'Thêm Đồ Mới' }} />
    </Stack>
  );
}

import { Stack } from 'expo-router';

export default function WardrobeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Tủ Đồ', headerShown: false }} />
      <Stack.Screen name="upload" options={{ title: 'Thêm trang phục', headerBackTitle: 'Trở lại', presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: 'Chi tiết trang phục', headerBackTitle: 'Trở lại' }} />
      <Stack.Screen name="edit/[id]" options={{ title: 'Sửa trang phục', headerBackTitle: 'Trở lại' }} />
    </Stack>
  );
}

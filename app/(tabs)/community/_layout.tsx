import { Stack } from 'expo-router';

export default function CommunityLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Cộng đồng', headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: 'Chi tiết bài viết', headerBackTitle: 'Trở lại' }} />
    </Stack>
  );
}

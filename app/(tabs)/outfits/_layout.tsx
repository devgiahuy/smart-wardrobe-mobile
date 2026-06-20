import { Stack } from 'expo-router';

export default function OutfitsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Bộ phối', headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: 'Chi tiết', headerBackTitle: 'Trở lại' }} />
    </Stack>
  );
}

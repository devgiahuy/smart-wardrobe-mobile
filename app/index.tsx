import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';

export default function HomeScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/wardrobe" />;
  }

  return <Redirect href="/(auth)/login" />;
}

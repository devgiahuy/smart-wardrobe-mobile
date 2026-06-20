import { Stack } from "expo-router";
import { useEffect } from "react";
import { usePathname } from "expo-router";
import { useFonts } from "expo-font";
import { BodoniModa_400Regular } from "@expo-google-fonts/bodoni-moda";
import { HankenGrotesk_400Regular, HankenGrotesk_600SemiBold } from "@expo-google-fonts/hanken-grotesk";
import * as SplashScreen from "expo-splash-screen";
import "../src/global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const pathname = usePathname();

  const [loaded, error] = useFonts({
    BodoniModa: BodoniModa_400Regular,
    HankenGrotesk: HankenGrotesk_400Regular,
    HankenGroteskSemiBold: HankenGrotesk_600SemiBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="outfits/create" />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

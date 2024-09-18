import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // If the user is not onboarded, redirect them to the onboarding screen.
  const router = useRouter();
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Check for onboarding status in SecureStore.
  const checkForOnboarded = async () => {
    const result = await SecureStore.getItemAsync("isOnboarded");
    setIsOnboarded(JSON.parse(result || "false"));

    if (!isOnboarded) {
      router.navigate("/onboarding");
    }
    console.log;
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }

    checkForOnboarded();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

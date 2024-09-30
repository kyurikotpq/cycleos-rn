import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import OnboardingScreen from "./onboarding";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [isLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Track if the user is onboarded
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Check for onboarding status in SecureStore.
  const checkForOnboarded = async () => {
    const result = await SecureStore.getItemAsync("isOnboarded");
    setIsOnboarded(JSON.parse(result || "false"));
  };

  const completeOnboarding = async () => {
    setIsOnboarded(true);
    const _ = await SecureStore.setItemAsync("isOnboarded", JSON.stringify(isOnboarded));
  }

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }

    checkForOnboarded();
  }, [isLoaded]);

  // Show the onboarding screen if user is not onboarded yet
  if (!isOnboarded) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

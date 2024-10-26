import {
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useLoadAssets } from "@/hooks/useLoadAssets";
import { expoDb } from "@/db/client";

import OnboardingScreen from "./onboarding";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useDrizzleStudio(expoDb);

  // Load assets and run migrations
  const { isLoaded } = useLoadAssets();

  // Track if the user is onboarded
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Check for onboarding status in SecureStore.
  const checkForOnboarded = async () => {
    const result = await SecureStore.getItemAsync("isOnboarded");
    setIsOnboarded(JSON.parse(result || "false"));
  };

  const completeOnboarding = async () => {
    const _ = await SecureStore.setItemAsync("isOnboarded", "true");
    setIsOnboarded(true);
  };

  useEffect(() => {
    checkForOnboarded();
  }, []);

  // Wait for assets to load and migrations to finish
  if (!isLoaded) return null;

  // Show the onboarding screen if user is not onboarded yet
  if (!isOnboarded) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="hormonoscope"
          options={{ title: "Today at a Glance" }}
        />
        <Stack.Screen
          name="cycles/add-cycle"
          options={{ title: "Enter Period" }}
        />
        <Stack.Screen
          name="tracking"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

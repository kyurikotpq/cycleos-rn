import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import "react-native-reanimated";

import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useLoadAssets } from "@/hooks/useLoadAssets";
import { expoDb } from "@/db/client";

import OnboardingScreen from "./onboarding";
import { initialize } from "react-native-health-connect";

import {
  PaperProvider,
} from "react-native-paper";
import { CycleOSTheme } from "@/constants/Theme";

export default function RootLayout() {
  useDrizzleStudio(expoDb);

  // Load assets and run migrations
  const { isLoaded } = useLoadAssets();

  // Track if the user is onboarded
  const [isOnboarded, setIsOnboarded] = useState(true);

  // Check for onboarding status in SecureStore.
  const checkForOnboarded = async () => {
    // Initialize the HealthConnect client
    const _ = await initialize();

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
    <PaperProvider theme={CycleOSTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        {/* Non-Tab Screens */}
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

        {/* Health Insights Detail Pages */}
        <Stack.Screen
          name="insights/health/steps"
          options={{ title: "Steps" }}
        />
        <Stack.Screen
          name="insights/health/sleep"
          options={{ title: "Sleep" }}
        />
        <Stack.Screen
          name="insights/integrated/phase"
          options={{ title: "Phase-based Insights" }}
        />
        <Stack.Screen
          name="insights/integrated/correlation"
          options={{ title: "Integrated Insights" }}
        />
      </Stack>
    </PaperProvider>
  );
}

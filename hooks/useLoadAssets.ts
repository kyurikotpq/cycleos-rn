import { db } from "@/db/client";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import migrations from "@/db/migrations/migrations";
import { seedSymptomsConstructs } from "@/db/seed";
import * as SecureStore from 'expo-secure-store';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

/**
 * Custom hook to load assets and run migrations.
 *
 * This hook loads fonts and runs database migrations, handling any errors that occur during these processes.
 * Once both the fonts are loaded and the migrations are successfully run, it hides the splash screen.
 *
 * @returns {Object} An object containing a boolean `isLoaded` which indicates whether both fonts have been loaded and migrations have been run.
 *
 * @throws Will throw an error if loading fonts or running migrations fails.
 */
export function useLoadAssets() {
  // Load fonts
  const [hasLoadedFonts, loadingFontsError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Run migrations
  const { success: hasRunMigrations, error: runningMigrationError } =
    useMigrations(db, migrations);

  // Seed database with symptoms
  const hasSeededDatabase = async () => {
    const result = await SecureStore.getItemAsync("isSeeded");
    if (!JSON.parse(result || "false")) return;

    await seedSymptomsConstructs();
    await SecureStore.setItemAsync("isSeeded", "true");
  }

  useEffect(() => {
    if (loadingFontsError) throw loadingFontsError;
    if (runningMigrationError) throw runningMigrationError;
  }, [loadingFontsError, runningMigrationError]);
  
  useEffect(() => {
    if (hasLoadedFonts && hasRunMigrations) {
      hasSeededDatabase();
      SplashScreen.hideAsync();
    }
  }, [hasLoadedFonts, hasRunMigrations]);

  return { isLoaded: hasLoadedFonts && hasRunMigrations };
}

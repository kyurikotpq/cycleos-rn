import { db } from "@/db/client";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import migrations from "@/db/migrations/migrations";

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
  const [hasLoadedFonts, loadingFontsError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { success: hasRunMigrations, error: runningMigrationError } =
    useMigrations(db, migrations);

  useEffect(() => {
    if (loadingFontsError) throw loadingFontsError;
    if (runningMigrationError) throw runningMigrationError;
  }, [loadingFontsError, runningMigrationError]);

  useEffect(() => {
    if (hasLoadedFonts && hasRunMigrations) {
      SplashScreen.hideAsync();
    }
  }, [hasLoadedFonts, hasRunMigrations]);

  return { isLoaded: hasLoadedFonts && hasRunMigrations };
}

import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useMemo, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";

import {
  ActivityIndicator,
  Appbar,
  SegmentedButtons,
  Surface,
} from "react-native-paper";
import HealthInsightsScreen from "../insights/health";
import { ThemedText } from "@/components/ThemedText";
import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import HealthConnectService from "@/services/HealthConnect";
import * as SecureStore from "expo-secure-store";
import { seedSymptomsConstructs } from "@/db/seed";
import IntegratedInsightsScreen from "../insights/integrated";

export default function InsightsScreen() {
  dayjs.extend(relativeTime);
  const todayDayJS = useMemo(() => dayjs(), []);

  const [screen, setScreen] = useState("health");
  const [syncing, setSyncing] = useState(true);
  const [syncedText, setSyncedText] = useState("Syncing...");

  const handleSyncFinish = (lastRetrievalTime: Dayjs) => {
    setSyncing(false);
    setSyncedText(`Last Synced: ${dayjs().to(lastRetrievalTime)}`);
  };

  const syncHCtoSQLite = async (force?: boolean) => {
    const now = dayjs();
    const lastRetrievalTime = await HealthConnectService.checkRetrievalTime(
      "Steps",
      todayDayJS
    );

    if (force || now.diff(lastRetrievalTime, "minutes") > 5) {
      setSyncing(true);
      setSyncedText("Syncing...");
      const syncResult = await HealthConnectService.syncAll(todayDayJS);
      handleSyncFinish(now);

      if (Object.values(syncResult).includes(false)) {
        console.log("Error in syncing:", syncResult);
      }
    } else {
      handleSyncFinish(lastRetrievalTime);
    }
  };

  useEffect(() => {
    syncHCtoSQLite();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content
          title={`Life Insights`}
          titleStyle={{ fontWeight: "bold" }}
        />
        <ThemedText style={{ fontSize: 14, marginRight: 10 }}>
          {syncedText}
        </ThemedText>
        {syncing && (
          <ActivityIndicator animating={syncing} style={{ marginRight: 20 }} />
        )}
      </Appbar.Header>
      <SegmentedButtons
        value={screen}
        onValueChange={setScreen}
        style={{
          marginTop: 20,
          marginRight: 20,
          marginBottom: 30,
          marginLeft: 20,
        }}
        buttons={[
          {
            value: "health",
            label: "Health",
          },
          {
            value: "trends",
            label: "Integrated Trends",
          },
        ]}
      />
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={syncing}
            onRefresh={() => syncHCtoSQLite(true)}
          />
        }
      >
        <Surface
          elevation={0}
          style={{ paddingBottom: 20, paddingRight: 20, paddingLeft: 20 }}
        >
          {screen === "health" && <HealthInsightsScreen />}
          {screen === "trends" && <IntegratedInsightsScreen />}
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});

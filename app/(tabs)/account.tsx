import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform, SafeAreaView } from "react-native";
import {
  openHealthConnectSettings,
} from "react-native-health-connect";
import { Appbar, List } from "react-native-paper";
import {router} from "expo-router";

export default function AccountScreen() {
  return (
    <SafeAreaView>
      <Appbar.Header>
        <Appbar.Content
          title={`Preferences`}
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <List.Section>
        <List.Item
          title="HealthConnect Settings"
          onPress={() => openHealthConnectSettings()}
          right={() => (
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#808080"
              style={{ marginRight: 10 }}
            />
          )}
        />
        <List.Item
          title="Synced Calendars"
          onPress={() => router.push("/account/calendars")}
          right={() => (
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#808080"
              style={{ marginRight: 10 }}
            />
          )}
        />
      </List.Section>
    </SafeAreaView>
  );
}


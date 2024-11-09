import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform, SafeAreaView } from "react-native";
import {
  openHealthConnectSettings,
  openHealthConnectDataManagement,
} from "react-native-health-connect";
import { Appbar, List } from "react-native-paper";

export default function TabTwoScreen() {
  return (
    <SafeAreaView>
      <Appbar.Header>
        <Appbar.Content
          title={`Account Settings`}
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
          title="Google Calendar"
          onPress={() => console.log("NOT IMPLEMENTED")}
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

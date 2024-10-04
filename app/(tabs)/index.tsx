import { Image, StyleSheet, Platform, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Appbar, Avatar, Drawer, Card, Text, FAB } from "react-native-paper";
import HormonoscopeCard from "@/components/HormonoscopeCard";
import { router } from "expo-router";

export default function AgendaScreen() {
  return (
    <>
      <Appbar.Header>
        {/* @TODO: This will open the drawer for changing to a weekly or monthly view */}
        <Appbar.Action icon="menu" onPress={() => {}} />

        {/* @TODO: Include a drawer component to show/hide */}
      </Appbar.Header>
      <ThemedView style={styles.p20}>
        <ThemedView style={styles.p20}>
          <ThemedText>@TODO: Date picker goes here at some point</ThemedText>
        </ThemedView>
        <HormonoscopeCard style={{ marginBottom: 40 }} />

        <Text variant="labelLarge">Agenda</Text>
        <ThemedView>
          <Card>
            <ThemedText>
              @TODO: Event show up here in a list (flex column)
            </ThemedText>
          </Card>
        </ThemedView>
      </ThemedView>
      <FAB icon="emoticon-outline" style={styles.fab} onPress={() => router.push("/tracking")} />

    </>
  );
}

const styles = StyleSheet.create({
  p20: {
    padding: 20,
  },
  fab: {
    position: 'absolute',
    margin: 25,
    right: 0,
    bottom: 0,
  },
});

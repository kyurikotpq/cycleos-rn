import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useState, useCallback } from "react";
import { Appbar, Portal, Surface } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { Cycle } from "@/db/schema";
import { deleteCycle, fetchCycles } from "@/db/controllers/cycles";
import { ThemedText } from "@/components/ThemedText";
import CycleCard from "@/components/cards/CycleCard";
import ConfirmCycleDeleteDialog from "@/components/dialogs/ConfirmCycleDeleteDialog";

export default function CyclesScreen() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [cycleToDelete, setCycleToDelete] = useState<Cycle | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEditOrDelete = (action: string, cycle: Cycle) => {
    if (action === "edit" && cycle.startDate && cycle.periodLength) {
      // @TODO: Disallow editing cycles older than 12 months
      const params = {
        scrollTo: cycle.id != cycles[0].id ? cycle.startDate : "-1",
      };
      router.navigate({ pathname: "/cycles/add-cycle", params });
    } else if (action === "delete") {
      setCycleToDelete(cycle);
      setShowDeleteDialog(true);
    }
  };

  const handleDeleteDialogDismiss = async (confirm: boolean) => {
    if (confirm && cycleToDelete) {
      // Delete cycle from DB
      await deleteCycle(cycleToDelete.id);
      await fetchData();
      setCycleToDelete(null);
    }
    setShowDeleteDialog(false);
  };

  const fetchData = async () => {
    // Tell React Native that there's a change
    setCycles([]);

    // Fetch cycles from DB
    const result = await fetchCycles();
    setCycles(result);
  };

  useFocusEffect(
    useCallback(() => {
      // Fetch data when coming back to this screen
      // (required after adding or editing a cycle)
      fetchData();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content
          title={`Your Cycle History`}
          titleStyle={{ fontWeight: "bold" }}
        />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            router.navigate("/cycles/add-cycle");
          }}
        />
      </Appbar.Header>
      <ScrollView style={{ flex: 1 }}>
        {/* 
        - <Surface> is needed to establish elevation context.
        - Padding needs to be applied to Surface, not ScrollView,
          so that the shadows are correct. */}
        <Surface elevation={0} style={{ padding: 20 }}>
          {cycles[0] && (
            <CycleCard
              cycle={cycles[0]}
              isCurrentCycle={true}
              onEditOrDelete={handleEditOrDelete}
            />
          )}

          <ThemedText
            variant="subtitle"
            style={{ fontWeight: 700, marginTop: 20, marginBottom: 10 }}
          >
            Previous Cycles
          </ThemedText>
          {cycles.length === 0 ? (
            <ThemedText>No previous cycles yet.</ThemedText>
          ) : (
            cycles
              .slice(1)
              .map((c: Cycle) => (
                <CycleCard
                  key={c.id}
                  cycle={c}
                  isCurrentCycle={false}
                  onEditOrDelete={handleEditOrDelete}
                />
              ))
          )}
        </Surface>
      </ScrollView>
      <Portal>
        {/* Render dialogs */}
        {cycleToDelete && (
          <ConfirmCycleDeleteDialog
            cycle={cycleToDelete}
            visible={showDeleteDialog}
            onDismiss={handleDeleteDialogDismiss}
          />
        )}
      </Portal>
    </SafeAreaView>
  );
}

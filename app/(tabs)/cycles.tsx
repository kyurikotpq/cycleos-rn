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
  const [prevCycles, setPrevCycles] = useState<Cycle[]>([]);
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
  const [cycleToDelete, setCycleToDelete] = useState<Cycle | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEditOrDelete = (action: string, cycle: Cycle) => {
    if (action === "edit") {
      router.navigate("/cycles/edit-cycle", { cycle });
    } else if (action === "delete") {
      setCycleToDelete(cycle);
      setShowDeleteDialog(true);
    }
  };

  const handleDeleteDialogDismiss = async (confirm: boolean) => {
    console.log(confirm);
    if (confirm && cycleToDelete) {
      // Delete cycle from DB
      await deleteCycle(cycleToDelete.id);
      await fetchData();
    }
    setShowDeleteDialog(false);
  };

  const fetchData = async () => {
    // Fetch cycles from DB
    const result = await fetchCycles();
    const activeCycle = result.shift();

    setCurrentCycle(activeCycle ?? null);
    setPrevCycles([]); // Tell React Native that there's a change
    setPrevCycles(result);
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
          {currentCycle && (
            <CycleCard
              cycle={currentCycle}
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
          {prevCycles.length === 0 ? (
            <ThemedText>No previous cycles yet.</ThemedText>
          ) : (
            prevCycles.map((c: Cycle) => (
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

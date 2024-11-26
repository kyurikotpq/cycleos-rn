import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View, StyleSheet, ScrollView } from "react-native";

export interface HeatMapProps {
  data: any[];
  direction?: "horizontal" | "vertical"; // Data flow (horizontal = LTR, vertical = TTB)
  xLabels?: string[];
  yLabels?: string[];
  numColumns?: number; // Number of columns
  cellSize?: number; // Number of columns
  numRows?: number; // Number of rows
  offsetX?: number; // Number of cells to offset in the first row (only for horizontal)
  offsetY?: number; // Number of cells to offset in the first column (only for vertical)
  color?: ColorProps;
  onPress?: (index: number) => void; // Callback when a cell is pressed
  shape?: "rectangle" | "circle";
}

export interface OpacityProps {
  opacity: number;
  limit: number;
}

export interface ColorProps {
  theme: string;
  opacities: OpacityProps[];
}

const defaultColorMap: ColorProps = {
  theme: "#09611F",
  opacities: [
    {
      opacity: 0.2,
      limit: 5,
    },
    {
      opacity: 0.4,
      limit: 10,
    },
    {
      opacity: 0.6,
      limit: 15,
    },
    {
      opacity: 0.8,
      limit: 20,
    },
    {
      opacity: 1,
      limit: 25,
    },
  ],
};

export default function InteractiveHeatmap({
  direction = "horizontal",
  xLabels,
  yLabels,
  numColumns = 0,
  numRows = 0,
  data, // 1D array of raw values
  offsetX = 0,
  offsetY = 0,
  cellSize = 25,
  color = defaultColorMap,
  shape = "rectangle",
  onPress,
}: HeatMapProps) {
  const [finalNumRows, setFinalNumRows] = useState(numRows ?? 0);
  const [finalNumColumns, setFinalNumColumns] = useState(numColumns ?? 0);

  const CELL_SPACING = 4;

  useEffect(() => {
    // Either numColumns or numRows should be provided
    if (!numColumns && !numRows) {
      return;
    } else if (direction == "horizontal") {
      if (!numColumns)
        throw new Error("numColumns must be provided for horizontal direction");

      if (offsetX >= numColumns)
        throw new Error("offsetX must be smaller than numColumns");

      // If numRows is not provided, calculate it from numColumns
      if (!numRows && numColumns) {
        setFinalNumRows(Math.ceil(data.length / numColumns));
      }
    } else if (direction == "vertical") {
      if (!numRows)
        throw new Error("numRows must be provided for vertical direction");

      if (offsetY >= numRows)
        throw new Error("offsetY must be smaller than numRows");

      // If numColumns is not provided, calculate it from numRows
      if (!numColumns && numRows) {
        setFinalNumColumns(Math.ceil(data.length / numRows));
      }
    }
  }, [numColumns, numRows]);

  const renderCells = useMemo(() => {
    let cells: any[] = [];

    const offset = direction === "horizontal" ? offsetX : offsetY;

    data.forEach((item, index) => {
      // Render the label
      if (
        numColumns &&
        yLabels &&
        // index >= numColumns - 1 &&
        (index == 0 || (index + offset) % numColumns === 0)
      ) {
        cells.push(
          <View
            key={`heatmap-suf-label-${index}`}
            style={[
              {
                width: cellSize,
                height: cellSize,

                backgroundColor: "transparent",
                marginRight: CELL_SPACING,
                marginBottom: CELL_SPACING,
                display: "flex",
                justifyContent: "center",
              },
            ]}
          >
            <Text
              style={{
                fontSize: cellSize / 2 - 1,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {yLabels[Math.ceil(index / numColumns)]}
            </Text>
          </View>
        );
      }
      // Render padding cells in the first row
      if (index == 0) {
        for (let i = 0; i < offset; i++) {
          cells.push(
            <View
              key={`heatmap-suf-padding-${i}`}
              style={[
                {
                  width: cellSize,
                  height: cellSize,
                  borderWidth: CELL_SPACING / 2,
                  borderColor: "transparent",
                  backgroundColor: "transparent",
                  marginRight: CELL_SPACING,
                  marginBottom: CELL_SPACING,
                },
              ]}
            />
          );
        }
      }

      cells.push(
        <Pressable
          key={`heatmap-suf-${index}`}
          style={[
            {
              width: cellSize,
              height: cellSize,
              backgroundColor: `rgba(100, 100, 100, ${item.opacityValue})`, // Make this themable
              marginRight: CELL_SPACING,
              marginBottom: CELL_SPACING,
              borderWidth: CELL_SPACING / 2,
              borderColor: item.borderColor ?? "transparent",
              borderStyle: item.borderStyle ?? "solid",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
          onPress={onPress ? () => onPress(item) : undefined}
        >
          {item.text ? (
            <Text style={{ fontWeight: "bold" }}>{item.text}</Text>
          ) : (
            <></>
          )}
        </Pressable>
      );
    });

    console.log("Number of cells", cells.length);
    return cells;
  }, [data]);

  return (
    <ScrollView
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <View
        style={{
          width:
            (finalNumColumns + 1) * cellSize +
            (finalNumColumns + 2) * CELL_SPACING,
          // backgroundColor: "red",
          flexDirection: direction == "horizontal" ? "row" : "column",
          flexWrap: "wrap",
        }}
      >
        {/* Render xLabels */}
        {xLabels && (
          <View
            style={[
              {
                width: cellSize,
                height: cellSize,
                marginRight: CELL_SPACING,
                backgroundColor: "transparent",
              },
            ]}
          />
        )}
        {xLabels &&
          xLabels.map((label, index) => (
            <View
              key={`heatmap-main-label-${index}`}
              style={{
                width: cellSize,
                height: cellSize,
                marginRight: CELL_SPACING,
                backgroundColor: "transparent",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={{
                  fontSize: cellSize / 2 - 1,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {label}
              </Text>
            </View>
          ))}

        {/* Render cells (with yLabels) */}
        {renderCells}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainBox: {
    display: "flex",
    flexDirection: "row",
    columnGap: 1,
    rowGap: 1,
  },
  sufBox: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    rowGap: 1,
    columnGap: 1,
  },
});

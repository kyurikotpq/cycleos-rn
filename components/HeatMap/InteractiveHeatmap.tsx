import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  ImageBackground,
} from "react-native";

export interface HeatMapProps {
  matrix: any[]; // 1D array of cells
  data: any;
  dataMatrixKey: string; // The key in matrix that links to `data`
  colorKey: string; // The key in `data` to use for colors
  xLabels?: string[];
  yLabels?: string[];
  numColumns?: number; // Number of columns
  cellSize?: number; // Size of cell in pixels
  offsetX?: number; // Number of cells to offset in the first row (only for horizontal)
  color?: ColorProps;
  cellBGImgMapping?: { [key: string]: any }; // Mapping of cell values to background image paths
  cellBGImgKey?: string; // The key in `data` to use for cell background images. Must exist in `cellBGImgMapping`
  onPress?: (index: number) => void; // Callback when a cell is pressed
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
  xLabels,
  yLabels,
  dataMatrixKey,
  colorKey,
  numColumns = 0,
  matrix, // 1D array of raw values
  data,
  offsetX = 0,
  cellSize = 35,
  cellBGImgMapping,
  cellBGImgKey,
  color = defaultColorMap,

  onPress,
}: HeatMapProps) {
  const [finalNumColumns, setFinalNumColumns] = useState(numColumns ?? 0);

  const CELL_SPACING = 4;

  useEffect(() => {
    // numColumns should be provided
    if (!numColumns) throw new Error("numColumns must be provided");
    else if (offsetX >= numColumns)
      throw new Error("offsetX must be smaller than numColumns");
  }, [numColumns]);

  const normalize = (value: number, min: number, max: number) =>
    (value - min) / (max - min);

  const renderCells = useMemo(() => {
    let cells: any[] = [];

    const offset = offsetX;

    // Normalize the color values
    const values = !data
      ? Array.from({ length: matrix?.length || 0 }, (_, i) => 0.01)
      : Object.values(data).map((item: any) => item[colorKey]);
    const colorMin = Math.min(...values);
    const colorMax = Math.max(...values);

    matrix.forEach((item, index) => {
      // Render the row labels (along the y-axis)
      if (
        numColumns &&
        yLabels &&
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
                fontSize: cellSize * 0.4,
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
                  backgroundColor: "transparent",
                  marginRight: CELL_SPACING,
                  marginBottom: CELL_SPACING,
                },
              ]}
            />
          );
        }
      }

      // Render interactive data cell
      const bgColorOpacity =
        dataMatrixKey && colorKey && data[item[dataMatrixKey]]
          ? data[item[dataMatrixKey]][colorKey] == colorMin
            ? 0.05 // Make sure the minimum has some color
            : normalize(data[item[dataMatrixKey]][colorKey], colorMin, colorMax)
          : 0;

      // Check if cellBGImgMapping and cellBGImgKey exist
      const bgImg =
        data &&
        dataMatrixKey &&
        cellBGImgMapping &&
        cellBGImgKey &&
        data[item[dataMatrixKey]] &&
        data[item[dataMatrixKey]][cellBGImgKey]
          ? cellBGImgMapping[
              data[item[dataMatrixKey]][cellBGImgKey] ?? "default"
            ]
          : "";

      cells.push(
        <Pressable
          key={`heatmap-suf-${index}`}
          style={[
            {
              width: cellSize,
              height: cellSize,
              backgroundColor: `rgba(0, 110, 144, ${bgColorOpacity})`,
              marginRight: CELL_SPACING,
              marginBottom: CELL_SPACING,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              borderColor: !bgColorOpacity ? "#c0c0c0" : "transparent",
              borderWidth: 1,
            },
          ]}
          onPress={
            onPress ? () => onPress(data[item[dataMatrixKey]]) : undefined
          }
        >
          {!bgImg ? (
            item.text && (
              <Text
                style={{
                  fontWeight: "bold",
                  color: bgColorOpacity < 0.5 ? "black" : "white",
                }}
              >
                {item.text}
              </Text>
            )
          ) : (
            <>
              <ImageBackground
                source={bgImg} // @ts-ignore
                tintColor={
                  bgColorOpacity < 0.5 ? "rgba(0, 0, 0, 0.7)" : "white"
                }
                style={{
                  flex: 1,
                  width: cellSize * 0.75,
                  height: cellSize * 0.75,
                  position: "absolute",
                  left: 0,
                  top: 0,
                }}
              />
              {item.text && (
                <Text
                  style={{
                    color: bgColorOpacity < 0.5 ? "black" : "white",
                    fontSize: cellSize * 0.35,
                    fontWeight: "bold",
                    position: "absolute",
                    bottom: 0,
                    right: 1,
                  }}
                >
                  {item.text}
                </Text>
              )}
            </>
          )}
        </Pressable>
      );
    });

    return cells;
  }, [data, colorKey]);

  return (
    <>
      <View
        style={{
          width:
            (finalNumColumns + 1) * cellSize +
            (finalNumColumns + 2) * CELL_SPACING,
          // backgroundColor: "red",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {/* Render xLabels (in the topmost "row") */}
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
        {/* Render the column labels */}
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
                  fontSize: cellSize * 0.4,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {label}
              </Text>
            </View>
          ))}
      </View>
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
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {/* Render cells (with yLabels) */}
          {renderCells}
        </View>
      </ScrollView>
    </>
  );
}

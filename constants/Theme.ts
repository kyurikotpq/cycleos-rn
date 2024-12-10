import {
  MD3LightTheme as DefaultTheme,
  configureFonts,
} from "react-native-paper";

export const CycleOSTheme = {
  ...DefaultTheme,
  colors: {
    "primary": "rgb(0, 102, 134)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(192, 232, 255)",
    "onPrimaryContainer": "rgb(0, 30, 43)",
    "secondary": "rgb(77, 97, 108)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(208, 230, 243)",
    "onSecondaryContainer": "rgb(9, 30, 39)",
    "tertiary": "rgb(94, 90, 125)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(228, 223, 255)",
    "onTertiaryContainer": "rgb(27, 23, 54)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(251, 252, 254)",
    "onBackground": "rgb(25, 28, 30)",
    "surface": "rgb(251, 252, 254)",
    "onSurface": "rgb(25, 28, 30)",
    "surfaceVariant": "rgb(220, 227, 233)",
    "onSurfaceVariant": "rgb(64, 72, 76)",
    "outline": "rgb(113, 120, 125)",
    "outlineVariant": "rgb(192, 199, 205)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(46, 49, 51)",
    "inverseOnSurface": "rgb(240, 241, 243)",
    "inversePrimary": "rgb(111, 210, 255)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(238, 245, 248)",
      "level2": "rgb(231, 240, 244)",
      "level3": "rgb(223, 236, 241)",
      "level4": "rgb(221, 234, 240)",
      "level5": "rgb(216, 231, 237)"
    },
    "surfaceDisabled": "rgba(25, 28, 30, 0.12)",
    "onSurfaceDisabled": "rgba(25, 28, 30, 0.38)",
    "backdrop": "rgba(42, 49, 54, 0.4)"
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0,
  },
};

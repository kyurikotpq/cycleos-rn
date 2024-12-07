/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from 'react-native';

import { CycleOSTheme } from '@/constants/Theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof CycleOSTheme.colors
) {

  // const theme = useColorScheme() ?? 'light';

  // Sep 18, 2024: We will use the light theme only
  const theme = 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return CycleOSTheme.colors[colorName];
  }
}

import { colors } from "./colors";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { fontSizes, fontWeights, lineHeights } from "./typography";

export const typography = {
  fontSizes,
  fontWeights,
  lineHeights
} as const;

export const theme = {
  colors,
  spacing,
  typography,
  shadows
} as const;

export { colors, spacing, fontSizes, fontWeights, lineHeights, shadows };

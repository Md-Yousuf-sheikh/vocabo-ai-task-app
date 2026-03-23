import { moderateScale, verticalScale } from "react-native-size-matters";

export const fontSizes = {
  xs: moderateScale(12),
  sm: moderateScale(14),
  md: moderateScale(16),
  lg: moderateScale(20),
  xl: moderateScale(24),
  xxl: moderateScale(32)
} as const;

export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700"
} as const;

export const lineHeights = {
  xs: verticalScale(16),
  sm: verticalScale(20),
  md: verticalScale(24),
  lg: verticalScale(28),
  xl: verticalScale(32),
  xxl: verticalScale(40)
} as const;


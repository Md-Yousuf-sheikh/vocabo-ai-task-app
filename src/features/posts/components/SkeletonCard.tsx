import { StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { colors, spacing } from "@theme";

export const SkeletonCard = () => {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 850, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [progress]);

  const shimmer = useAnimatedStyle(() => ({ opacity: 0.5 + progress.value * 0.4 }));

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.lineLg, shimmer]} />
      <Animated.View style={[styles.lineSm, shimmer]} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 14, padding: spacing.md, marginBottom: spacing.md },
  lineLg: { height: 18, borderRadius: 8, backgroundColor: colors.border, marginBottom: spacing.sm },
  lineSm: { height: 14, borderRadius: 8, backgroundColor: colors.border, width: "70%" }
});

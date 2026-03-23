import { memo } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { colors, spacing } from "@theme";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  size?: Size;
}

const sizeStyles: Record<Size, ViewStyle> = {
  sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl }
};

const variantStyles: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.secondary },
  ghost: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.border }
};

const ButtonComponent = ({ label, onPress, variant = "primary", loading = false, disabled = false, size = "md" }: ButtonProps) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const labelColor = variant === "ghost" ? colors.textSecondary : "#FFFFFF";

  return (
    <Pressable
      disabled={disabled || loading}
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
    >
      <Animated.View style={[styles.button, sizeStyles[size], variantStyles[variant], animatedStyle, disabled && styles.disabled]}>
        {loading ? <ActivityIndicator color={labelColor} /> : <Text style={[styles.label, { color: labelColor }]}>{label}</Text>}
      </Animated.View>
    </Pressable>
  );
};

export const Button = memo(ButtonComponent);

const styles = StyleSheet.create({
  button: { borderRadius: 12, alignItems: "center", justifyContent: "center" },
  label: { fontWeight: "700" },
  disabled: { opacity: 0.5 }
});

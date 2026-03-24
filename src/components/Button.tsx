import { memo } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, spacing } from "@theme";
import { triggerHaptic } from "@utils";

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
  const labelColor = variant === "ghost" ? colors.textSecondary : "#FFFFFF";

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={() => {
        void triggerHaptic();
        onPress();
      }}
    >
      <View style={[styles.button, sizeStyles[size], variantStyles[variant], disabled && styles.disabled]}>
        {loading ? <ActivityIndicator color={labelColor} /> : <Text style={[styles.label, { color: labelColor }]}>{label}</Text>}
      </View>
    </Pressable>
  );
};

export const Button = memo(ButtonComponent);

const styles = StyleSheet.create({
  button: { borderRadius: 12, alignItems: "center", justifyContent: "center" },
  label: { fontWeight: "700" },
  disabled: { opacity: 0.5 }
});

import { ReactNode, useEffect, useState } from "react";
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { colors, spacing } from "@theme";

interface InputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  keyboardType?: KeyboardTypeOptions;
}

export const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  leftIcon,
  rightIcon,
  keyboardType = "default"
}: InputProps) => {
  const focusProgress = useSharedValue(value ? 1 : 0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value) focusProgress.value = withTiming(1);
  }, [value, focusProgress]);

  const labelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(focusProgress.value, [0, 1], [0, -18]) }],
    fontSize: interpolate(focusProgress.value, [0, 1], [14, 12]),
    color: interpolateColor(focusProgress.value, [0, 1], [colors.text, colors.textSecondary])
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
      <View style={[styles.container, isFocused && styles.focusedBorder, error ? styles.errorBorder : undefined]}>
        {leftIcon}
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          onFocus={() => {
            setIsFocused(true);
            focusProgress.value = withTiming(1, { duration: 180 });
          }}
          onBlur={() => {
            setIsFocused(false);
            if (!value) focusProgress.value = withTiming(0, { duration: 180 });
          }}
        />
        {rightIcon}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: { color: colors.textSecondary, marginBottom: spacing.xs },
  container: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.surface, paddingHorizontal: spacing.sm, flexDirection: "row", alignItems: "center" },
  input: { color: colors.text, flex: 1, paddingVertical: spacing.sm },
  focusedBorder: { borderColor: colors.primary },
  errorBorder: { borderColor: colors.error },
  errorText: { color: colors.error, marginTop: spacing.xs }
});

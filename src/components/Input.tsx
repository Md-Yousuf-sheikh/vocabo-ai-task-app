import { ReactNode, useEffect, useState } from "react";
import { Keyboard, KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from "react-native";
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
  const [isFocused, setIsFocused] = useState(false);
  const [isRaised, setIsRaised] = useState(Boolean(value));

  useEffect(() => {
    setIsRaised(Boolean(value) || isFocused);
  }, [value, isFocused]);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, isRaised && styles.labelRaised]}>{label}</Text>
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
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          onSubmitEditing={Keyboard.dismiss}
        />
        {rightIcon}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.sm },
  label: { color: colors.textSecondary, marginBottom: spacing.xs, fontWeight: "500" },
  labelRaised: { fontSize: 12, color: colors.textSecondary, transform: [{ translateY: -5 }] },
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center"
  },
  input: { color: colors.text, flex: 1, paddingVertical: spacing.sm + 2 },
  focusedBorder: { borderColor: colors.primary },
  errorBorder: { borderColor: colors.error },
  errorText: { color: colors.error, marginTop: spacing.xs, fontSize: 12 }
});

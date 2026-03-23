import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Input } from "@components";
import { useRegister } from "@hooks";
import { colors, spacing } from "@theme";
import { isValidPassword } from "@utils";
import type { AuthStackParamList } from "@types";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export const RegisterScreen = ({ navigation }: Props) => {
  const { register, isLoading, error } = useRegister();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordError = password.length > 0 && !isValidPassword(password) ? "Password should be at least 6 chars" : "";
  const confirmError = confirmPassword.length > 0 && confirmPassword !== password ? "Passwords do not match" : "";

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <Animated.View entering={FadeInUp.duration(260)} style={styles.content}>
        <Text style={styles.greeting}>Join</Text>
        <Text style={styles.title}>Today</Text>
        <Text style={styles.subtitle}>Create an account to get started</Text>

        <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
        <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry error={passwordError} />
        <Input label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry error={confirmError} />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Button
          label="Register"
          onPress={() => {
            Keyboard.dismiss();
            void register(email, password);
          }}
          loading={isLoading}
          disabled={Boolean(passwordError || confirmError)}
        />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkWrap}>
          <Text style={styles.link}>Already have an account? <Text style={styles.linkStrong}>Login</Text></Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: spacing.lg,
    paddingTop: (StatusBar.currentHeight ?? 0) + spacing.md
  },
  content: { backgroundColor: colors.surface, borderRadius: 24, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  greeting: { color: colors.text, fontSize: 34, fontWeight: "800", lineHeight: 38 },
  title: { color: colors.primary, fontSize: 34, fontWeight: "800", lineHeight: 38, marginBottom: spacing.xs },
  subtitle: { color: colors.textSecondary, marginBottom: spacing.lg },
  error: { color: colors.error },
  linkWrap: { marginTop: spacing.md, alignSelf: "center" },
  link: { color: colors.textSecondary },
  linkStrong: { color: colors.primary, fontWeight: "700" }
});

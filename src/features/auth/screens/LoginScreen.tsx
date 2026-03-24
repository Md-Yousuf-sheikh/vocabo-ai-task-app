import { useState } from "react";
import { Keyboard, StatusBar, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Button, ErrorCard, HapticTouchable, Input } from "@components";
import { useLogin } from "@hooks";
import { colors, spacing } from "@theme";
import type { AuthStackParamList } from "@types";
import { isValidEmail } from "@utils";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export const LoginScreen = ({ navigation }: Props) => {
  const { login, loginWithGoogle, isLoading, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailError =
    email.length > 0 && !isValidEmail(email)
      ? "Please enter a valid email"
      : "";

      console.log("error", error);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={spacing.md}
      >
        <Animated.View entering={FadeInUp.duration(260)} style={styles.content}>
          <Text style={styles.greeting}>Hello</Text>
          <Text style={styles.title}>Again!</Text>
          <Text style={styles.subtitle}>Welcome back, you've been missed</Text>

          <Input label="Username" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" error={emailError} />
          <Input label="Password" value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
          {!!error && <ErrorCard message={error} />}
          <Button
            label="Login"
            onPress={() => {
              Keyboard.dismiss();
              void login(email, password);
            }}
            loading={isLoading}
          />

          <Text style={styles.orText}>or continue with</Text>
          <View style={styles.socialRow}>
            <HapticTouchable style={styles.socialBtn} onPress={loginWithGoogle} disabled={isLoading}>
              <Ionicons name="logo-google" size={16} color={colors.error} />
              <Text style={styles.socialText}>Google</Text>
            </HapticTouchable>
          </View>

          <HapticTouchable onPress={() => navigation.navigate("Register")} style={styles.linkWrap}>
            <Text style={styles.link}>Don't have an account? <Text style={styles.linkStrong}>Sign Up</Text></Text>
          </HapticTouchable>
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    paddingTop: (StatusBar.currentHeight ?? 0) + spacing.md
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center"
  },
  content: { backgroundColor: colors.surface, borderRadius: 24, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  greeting: { color: colors.text, fontSize: 38, fontWeight: "800", lineHeight: 42 },
  title: { color: colors.primary, fontSize: 38, fontWeight: "800", lineHeight: 42, marginBottom: spacing.xs },
  subtitle: { color: colors.textSecondary, marginBottom: spacing.lg },
  orText: { textAlign: "center", color: colors.textSecondary, marginTop: spacing.sm, marginBottom: spacing.sm },
  socialRow: { flexDirection: "row", gap: spacing.sm },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background
  },
  socialText: { color: colors.textSecondary, fontWeight: "600" },
  linkWrap: { marginTop: spacing.md, alignSelf: "center" },
  link: { color: colors.textSecondary },
  linkStrong: { color: colors.primary, fontWeight: "700" }
});

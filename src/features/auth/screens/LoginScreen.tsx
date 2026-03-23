import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Input } from "@components";
import { useLogin } from "@hooks";
import { colors, spacing } from "@theme";
import type { AuthStackParamList } from "@types";
import { isValidEmail } from "@utils";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export const LoginScreen = ({ navigation }: Props) => {
  const { login, loginWithGoogle, isLoading, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailError = email.length > 0 && !isValidEmail(email) ? "Please enter a valid email" : "";

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <Animated.View entering={FadeInUp.duration(260)} style={styles.content}>
        <Text style={styles.title}>Welcome back</Text>
        <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" error={emailError} />
        <Input label="Password" value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Button label="Login" onPress={() => login(email, password)} loading={isLoading} />
        <View style={styles.spacer} />
        <Button label="Sign in with Google" onPress={loginWithGoogle} variant="secondary" disabled={isLoading} />
        <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.linkWrap}>
          <Text style={styles.link}>No account? Register</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "center", padding: spacing.lg },
  content: { gap: spacing.sm },
  title: { color: colors.text, fontSize: 28, fontWeight: "700", marginBottom: spacing.md },
  error: { color: colors.error },
  spacer: { height: spacing.xs },
  linkWrap: { marginTop: spacing.md, alignSelf: "center" },
  link: { color: colors.secondary }
});

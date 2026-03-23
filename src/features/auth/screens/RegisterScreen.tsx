import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
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
        <Text style={styles.title}>Create account</Text>
        <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" />
        <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry error={passwordError} />
        <Input label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry error={confirmError} />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Button label="Register" onPress={() => register(email, password)} loading={isLoading} disabled={Boolean(passwordError || confirmError)} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkWrap}>
          <Text style={styles.link}>Back to login</Text>
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
  linkWrap: { marginTop: spacing.md, alignSelf: "center" },
  link: { color: colors.secondary }
});

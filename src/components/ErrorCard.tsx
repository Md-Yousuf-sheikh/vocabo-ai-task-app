import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontSizes, spacing } from "@theme";

interface ErrorCardProps {
  message: string;
}

export const ErrorCard = ({ message }: ErrorCardProps) => {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={16} color={colors.error} style={styles.icon} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: `${colors.error}40`,
    backgroundColor: `${colors.error}14`,
    flexDirection: "row",
    gap: spacing.xs,
  },
  text: {
    color: colors.error,
    flex: 1,
    fontWeight: "500",
    fontSize: fontSizes.xs,
  },
  icon: {
    marginTop: 2,
  },
});

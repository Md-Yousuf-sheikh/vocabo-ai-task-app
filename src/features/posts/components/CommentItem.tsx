import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import type { Comment } from "@types";
import { colors, spacing } from "@theme";
import { formatDate } from "@utils";

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <Animated.View entering={FadeInRight.duration(220)}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>U</Text>
        </View>
      <View style={styles.card}>
        <View style={styles.metaRow}>
          <Text style={styles.author}>You</Text>
          <View style={styles.dot} />
          <Text style={styles.date}>{formatDate(comment.createdAt)}</Text>
        </View>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, marginBottom: spacing.sm },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(47, 128, 237, 0.16)"
  },
  avatarText: { color: colors.primary, fontWeight: "700", fontSize: 12 },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginBottom: spacing.xs },
  author: { color: colors.text, fontSize: 12, fontWeight: "700" },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
  text: { color: colors.text, lineHeight: 20 },
  date: { color: colors.textSecondary, fontSize: 12, fontWeight: "600" }
});

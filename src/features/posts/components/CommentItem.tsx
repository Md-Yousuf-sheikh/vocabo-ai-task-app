import { StyleSheet, Text } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import type { Comment } from "@types";
import { Card } from "@components";
import { colors, spacing } from "@theme";
import { formatDate } from "@utils";

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <Animated.View entering={FadeInRight.duration(220)}>
      <Card style={styles.card}>
        <Text style={styles.text}>{comment.text}</Text>
        <Text style={styles.date}>{formatDate(comment.createdAt)}</Text>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: spacing.sm },
  text: { color: colors.text, marginBottom: spacing.xs },
  date: { color: colors.textSecondary, fontSize: 12 }
});

import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Post } from "@types";
import { Card } from "@components";
import { colors, spacing } from "@theme";
import { truncateText } from "@utils";

interface PostCardProps {
  post: Post;
  liked?: boolean;
  likesCount?: number;
  commentsCount?: number;
  onPress: () => void;
}

const PostCardComponent = ({
  post,
  liked = false,
  likesCount = 0,
  commentsCount = 0,
  onPress,
}: PostCardProps) => {
  return (
    <Card onPress={onPress} style={styles.card}>
      <Text numberOfLines={1} style={styles.title}>
        {post.title}
      </Text>
      <Text numberOfLines={2} style={styles.body}>
        {truncateText(post.body, 96)}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.publisher}>News Desk</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.publisher}>14m ago</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.row}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={16}
            color={liked ? colors.error : colors.textSecondary}
          />
          <Text style={styles.meta}>{likesCount}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons
            name="chatbubble-outline"
            size={15}
            color={colors.textSecondary}
          />
          <Text style={styles.meta}>{commentsCount}</Text>
        </View>
      </View>
    </Card>
  );
};

export const PostCard = memo(PostCardComponent);

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  category: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontWeight: "700",
    marginBottom: spacing.xs,
    fontSize: 18,
    lineHeight: 24,
    textTransform: "capitalize",
  },
  body: { color: colors.textSecondary, lineHeight: 20 },
  metaRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  publisher: { color: colors.textSecondary, fontSize: 12 },
  dot: { color: colors.textSecondary, fontSize: 12 },
  footer: { marginTop: spacing.md, flexDirection: "row", gap: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  meta: { color: colors.textSecondary, fontWeight: "600" },
});

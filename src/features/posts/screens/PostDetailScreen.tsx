import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Input, LoadingSpinner } from "@components";
import { useLikeComment, usePostDetail } from "@hooks";
import { colors, spacing } from "@theme";
import type { Comment, PostsStackParamList } from "@types";
import { CommentItem } from "../components/CommentItem";

type Props = NativeStackScreenProps<PostsStackParamList, "PostDetail">;

export const PostDetailScreen = ({ route }: Props) => {
  const { postId } = route.params;
  const { post, isLoading, error } = usePostDetail(postId);
  const { liked, toggleLike, comments, addComment } = useLikeComment(postId);
  const [commentText, setCommentText] = useState("");
  const likeProgress = useSharedValue(liked ? 1 : 0);

  const likeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 + likeProgress.value * 0.1) }],
    opacity: interpolate(likeProgress.value, [0, 1], [0.85, 1])
  }));

  const onToggleLike = async () => {
    const next = liked ? 0 : 1;
    likeProgress.value = withTiming(next, { duration: 220 });
    await toggleLike();
  };

  if (isLoading) return <LoadingSpinner message="Loading post..." />;
  if (error || !post) return <Text style={styles.error}>{error ?? "Post not found"}</Text>;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.body}>{post.body}</Text>

        <TouchableOpacity onPress={onToggleLike} style={styles.likeRow}>
          <Animated.View style={likeStyle}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={24} color={liked ? colors.error : colors.textSecondary} />
          </Animated.View>
          <Text style={styles.likeText}>{liked ? "Liked" : "Like this post"}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Comments ({comments.length})</Text>
        <FlatList<Comment> data={comments} keyExtractor={(item) => item.id.toString()} scrollEnabled={false} renderItem={({ item }) => <CommentItem comment={item} />} />
      </ScrollView>

      <View style={styles.inputWrap}>
        <Input label="Add comment" value={commentText} onChangeText={setCommentText} placeholder="Write a comment" />
        <TouchableOpacity
          onPress={async () => {
            if (!commentText.trim()) return;
            await addComment(commentText.trim());
            setCommentText("");
          }}
          style={styles.sendBtn}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  title: { color: colors.text, fontSize: 24, fontWeight: "700", marginBottom: spacing.md },
  body: { color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.lg },
  likeRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.lg },
  likeText: { color: colors.textSecondary },
  sectionTitle: { color: colors.text, fontWeight: "700", marginBottom: spacing.sm },
  inputWrap: { borderTopWidth: 1, borderColor: colors.border, padding: spacing.md, backgroundColor: colors.surface },
  sendBtn: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: spacing.sm, alignItems: "center" },
  sendText: { color: colors.text, fontWeight: "700" },
  error: { color: colors.error, textAlign: "center", marginTop: spacing.xl }
});

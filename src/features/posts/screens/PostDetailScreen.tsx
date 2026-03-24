import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Keyboard,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView, KeyboardStickyView } from "react-native-keyboard-controller";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { ArrowLeft2, MessageText1, More, Send2 } from "iconsax-react-native";
import { LoadingSpinner } from "@components";
import { useLikeComment, usePostDetail } from "@hooks";
import { colors, spacing } from "@theme";
import type { Comment, PostsStackParamList } from "@types";
import { CommentItem } from "../components/CommentItem";

type Props = NativeStackScreenProps<PostsStackParamList, "PostDetail">;

export const PostDetailScreen = ({ route, navigation }: Props) => {
  const { postId } = route.params;
  const { post, isLoading, error } = usePostDetail(postId);
  const { liked, toggleLike, comments, addComment } = useLikeComment(postId);
  const [commentText, setCommentText] = useState("");
  const likeProgress = useSharedValue(liked ? 1 : 0);

  const likeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 + likeProgress.value * 0.1) }],
    opacity: interpolate(likeProgress.value, [0, 1], [0.85, 1]),
  }));

  useEffect(() => {
    likeProgress.value = liked ? 1 : 0;
  }, [liked, likeProgress]);

  const onToggleLike = async () => {
    const next = liked ? 0 : 1;
    likeProgress.value = withTiming(next, { duration: 220 });
    await toggleLike();
  };
  const isOfflineError = useMemo(() => {
    if (!error) return false;
    const normalized = error.toLowerCase();
    return normalized.includes("network request failed") || normalized.includes("network");
  }, [error]);

  if (isLoading) return <LoadingSpinner message="Loading post..." />;
  if (error || !post) {
    if (isOfflineError) {
      return (
        <View style={styles.centered}>
          <View style={styles.offlineCard}>
            <Text style={styles.offlineTitle}>No Internet Connection</Text>
            <Text style={styles.offlineText}>
              Turn on your internet and try again. You can also open settings to connect quickly.
            </Text>
            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={() => {
                void Linking.openSettings();
              }}
            >
              <Text style={styles.settingsBtnText}>Open Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.retryBtnText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return <Text style={styles.error}>{error ?? "Post not found"}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft2 size={20} color={colors.text} variant="Linear" />
        </TouchableOpacity>

      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={spacing.md}
      >
        <View style={styles.coverPlaceholder}>
          <Text style={styles.coverText}>Featured Story</Text>
        </View>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.body}>{post.body}</Text>

        <View style={styles.actionBar}>
          <TouchableOpacity onPress={onToggleLike} style={styles.likeRow}>
            <Animated.View style={likeStyle}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={22}
                color={liked ? colors.error : colors.textSecondary}
              />
            </Animated.View>
            <Text style={styles.likeText}>{liked ? "Liked" : "Like"}</Text>
          </TouchableOpacity>
          <View style={styles.commentStat}>
            <Ionicons
              name="chatbubble-outline"
              size={18}
              color={colors.textSecondary}
            />
            <Text style={styles.likeText}>{comments.length}</Text>
          </View>
        </View>

        <View style={styles.commentsWrap}>
          <View style={styles.commentsHeader}>
            <View style={styles.commentsLeft}>
              <MessageText1 size={18} color={colors.primary} variant="Bold" />
              <Text style={styles.sectionTitle}>Comments</Text>
            </View>
            <View style={styles.countPill}>
              <Text style={styles.countText}>{comments.length}</Text>
            </View>
          </View>
          {comments.length > 0 ? (
            <FlatList<Comment>
              data={comments}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => <CommentItem comment={item} />}
            />
          ) : (
            <View style={styles.emptyComments}>
              <Text style={styles.emptyCommentsText}>
                No comments yet. Start the conversation.
              </Text>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>

      <KeyboardStickyView>
        <View style={styles.inputWrap}>
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Write a comment..."
            placeholderTextColor={colors.textSecondary}
            style={styles.commentInput}
            multiline
          />
          <TouchableOpacity
            onPress={async () => {
              Keyboard.dismiss();
              if (!commentText.trim()) return;
              await addComment(commentText.trim());
              setCommentText("");
            }}
            style={[
              styles.sendBtn,
              !commentText.trim() && styles.sendBtnDisabled,
            ]}
            disabled={!commentText.trim()}
          >
            <Send2 size={18} color="#000000" variant="Bold" />
          </TouchableOpacity>
        </View>
      </KeyboardStickyView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: (StatusBar.currentHeight ?? 50),
  },
  content: { padding: spacing.sm, paddingBottom: spacing.xl,  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  coverPlaceholder: {
    height: 190,
    borderRadius: 18,
    backgroundColor: "#DCE9FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  coverText: { color: colors.primary, fontWeight: "700" },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: spacing.sm,
    lineHeight: 36,
    textTransform: "capitalize",
  },
  body: {
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
    fontSize: 16,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  likeRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  commentStat: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  likeText: { color: colors.textSecondary, fontWeight: "600" },
  commentsWrap: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  commentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  commentsLeft: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  sectionTitle: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 18,
  },
  countPill: {
    backgroundColor: "rgba(47, 128, 237, 0.12)",
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  countText: { color: colors.primary, fontWeight: "700", fontSize: 12 },
  emptyComments: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
  },
  emptyCommentsText: { color: colors.textSecondary, textAlign: "center" },
  inputWrap: {
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,

  },
  commentInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  sendBtnDisabled: { opacity: 0.50 },
  error: { color: colors.error, textAlign: "center", marginTop: spacing.xl },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  offlineCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  offlineTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  offlineText: {
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  settingsBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm + 2,
  },
  settingsBtnText: {
    color: colors.primary,
    fontWeight: "700",
  },
  retryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm + 2,
  },
  retryBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});

import { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  Linking,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowUp2, CloseCircle, ProfileCircle, SearchNormal1 } from "iconsax-react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Button, LoadingSpinner } from "@components";
import { usePosts } from "@hooks";
import { colors, spacing } from "@theme";
import type { Post, PostsStackParamList } from "@types";
import { STORAGE_KEYS } from "@utils";
import { PostCard } from "../components/PostCard";
import { SkeletonCard } from "../components/SkeletonCard";

type Props = NativeStackScreenProps<PostsStackParamList, "PostsList">;

export const PostsListScreen = ({ navigation }: Props) => {
  const { posts, isLoading, error, refetch } = usePosts();
  const [interactionState, setInteractionState] = useState<
    Record<number, { liked: boolean; commentsCount: number }>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const listRef = useRef<FlatList<Post>>(null);
  const searchAnim = useSharedValue(0);
  const skeletonData = useMemo(() => [1, 2, 3], []);
  const getItemLayout = (_: unknown, index: number) => ({
    length: 132,
    offset: 132 * index,
    index,
  });
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const basePosts = posts.slice(0, 8);
    if (!query) return basePosts;
    return basePosts.filter((post) =>
      `${post.title} ${post.body}`.toLowerCase().includes(query),
    );
  }, [posts, searchQuery]);

  const loadInteractionState = useCallback(async () => {
    if (posts.length === 0) return;

    const keys = posts.flatMap((post) => [
      `${STORAGE_KEYS.likesPrefix}${post.id}`,
      `${STORAGE_KEYS.commentsPrefix}${post.id}`,
    ]);
    const stored = await AsyncStorage.multiGet(keys);

    const nextState: Record<number, { liked: boolean; commentsCount: number }> =
      {};
    for (let index = 0; index < stored.length; index += 2) {
      const likeEntry = stored[index];
      const commentsEntry = stored[index + 1];
      const post = posts[Math.floor(index / 2)];
      if (!post) continue;

      const liked = likeEntry?.[1] === "true";
      const commentsRaw = commentsEntry?.[1];
      let commentsCount = 0;
      if (commentsRaw) {
        try {
          const parsed = JSON.parse(commentsRaw) as unknown[];
          commentsCount = parsed.length;
        } catch {
          commentsCount = 0;
        }
      }

      nextState[post.id] = { liked, commentsCount };
    }

    setInteractionState(nextState);
  }, [posts]);

  useFocusEffect(
    useCallback(() => {
      void loadInteractionState();
    }, [loadInteractionState]),
  );

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    maxHeight: 60 * searchAnim.value,
    opacity: searchAnim.value,
    transform: [{ translateY: (1 - searchAnim.value) * -8 }]
  }));
  const isOfflineError = useMemo(() => {
    if (!error) return false;
    const normalized = error.toLowerCase();
    return normalized.includes("network request failed") || normalized.includes("network");
  }, [error]);

  if (isLoading && posts.length === 0) {
    return (
      <View style={styles.container}>
        {skeletonData.map((id) => (
          <SkeletonCard key={id} />
        ))}
      </View>
    );
  }

  if (error && posts.length === 0) {
    if (isOfflineError) {
      return (
        <View style={styles.centered}>
          <View style={styles.offlineCard}>
            <Text style={styles.offlineTitle}>No Internet Connection</Text>
            <Text style={styles.offlineText}>
              Turn on your internet and try again. You can also open settings to connect quickly.
            </Text>
            <View style={styles.offlineActions}>
              <Button label="Try Again" onPress={refetch} />
              <TouchableOpacity
                style={styles.settingsBtn}
                onPress={() => {
                  void Linking.openSettings();
                }}
              >
                <Text style={styles.settingsBtnText}>Open Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <Button label="Retry" onPress={refetch} />
      </View>
    );
  }

  if (!isLoading && posts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>No posts found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.hello}>Good Morning</Text>
            <Text style={styles.headline}>Explore Today</Text>
          </View>
          <View style={styles.actionsWrap}>
            <TouchableOpacity
              style={styles.notifyWrap}
              onPress={() => {
                setIsSearchOpen((prev) => {
                  const next = !prev;
                  searchAnim.value = withTiming(next ? 1 : 0, { duration: 220 });
                  if (!next) {
                    setSearchQuery("");
                    Keyboard.dismiss();
                  }
                  return next;
                });
              }}
            >
              <SearchNormal1 size={20} color={colors.text} variant="Linear" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notifyWrap} onPress={() => navigation.navigate("Profile")}>
              <ProfileCircle size={20} color={colors.text} variant="Linear" />
            </TouchableOpacity>
          </View>
        </View>
        <Animated.View style={[styles.searchAnimWrap, searchAnimatedStyle]}>
          <View style={styles.searchWrap}>
            <SearchNormal1
              size={18}
              color={colors.textSecondary}
              variant="Linear"
            />
            <TextInput
              style={styles.search}
              placeholder="Search posts..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={Keyboard.dismiss}
            />
            {searchQuery.trim().length > 0 ? (
              <Pressable
                onPress={() => setSearchQuery("")}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Clear search text"
              >
                <CloseCircle size={18} color={colors.textSecondary} variant="Bold" />
              </Pressable>
            ) : null}
          </View>
        </Animated.View>
      </View>

      <FlatList<Post>
        data={filteredPosts}
        style={styles.list}
        contentContainerStyle={styles.content}
        keyExtractor={(item) => item.id.toString()}
        getItemLayout={getItemLayout}
        ref={listRef}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            liked={interactionState[item.id]?.liked ?? false}
            likesCount={interactionState[item.id]?.liked ? 1 : 0}
            commentsCount={interactionState[item.id]?.commentsCount ?? 0}
            onPress={() => navigation.navigate("PostDetail", { postId: item.id })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.empty}>
              No results for "{searchQuery.trim()}"
            </Text>
          </View>
        }
        ListFooterComponent={
          isLoading ? <LoadingSpinner message="Refreshing posts..." /> : null
        }
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          const y = event.nativeEvent.contentOffset.y;
          if (y > 240 && !showScrollTop) setShowScrollTop(true);
          if (y <= 240 && showScrollTop) setShowScrollTop(false);
        }}
        scrollEventThrottle={16}
      />
      {showScrollTop ? (
        <TouchableOpacity
          style={styles.toTopBtn}
          onPress={() => {
            listRef.current?.scrollToOffset({ offset: 0, animated: true });
          }}
        >
          <ArrowUp2 size={18} color="#FFFFFF" variant="Bold" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { flex: 1 },
  content: { padding: spacing.sm, paddingBottom: spacing.xxl + spacing.lg },
  headerWrap: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    paddingTop: StatusBar.currentHeight ?? 50,
    backgroundColor: colors.background,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  actionsWrap: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  notifyWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  hello: { color: colors.textSecondary, fontWeight: "600" },
  headline: { color: colors.text, fontSize: 30, fontWeight: "800" },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  searchAnimWrap: {
    overflow: "hidden"
  },
  search: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    color: colors.text,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  empty: { color: colors.textSecondary },
  error: { color: colors.error, marginBottom: spacing.md },
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
  offlineActions: {
    marginTop: spacing.xs,
    gap: spacing.sm,
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
  toTopBtn: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.xl + spacing.lg,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Keyboard,
  Linking,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ArrowUp2,
  CloseCircle,
  ProfileCircle,
  SearchNormal1,
} from "iconsax-react-native";
import { Button, HapticTouchable, LoadingSpinner } from "@components";
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
  const scrollTopAnim = useRef(new Animated.Value(0)).current;
  const listRef = useRef<FlatList<Post>>(null);
  const skeletonData = useMemo(() => [1, 2, 3], []);
  const getItemLayout = (_: unknown, index: number) => ({
    length: 132,
    offset: 132 * index,
    index,
  });

  // filter the posts based on the search query
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const basePosts = posts.slice(0, 8);
    if (!query) return basePosts;
    return basePosts.filter((post) =>
      `${post.title} ${post.body}`.toLowerCase().includes(query),
    );
  }, [posts, searchQuery]);

  // load the interaction state from AsyncStorage
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

  // load the interaction state when the screen is focused
  useFocusEffect(
    useCallback(() => {
      void loadInteractionState();
    }, [loadInteractionState]),
  );

  // check if the error is an offline error
  const isOfflineError = useMemo(() => {
    if (!error) return false;
    const normalized = error.toLowerCase();
    return (
      normalized.includes("network request failed") ||
      normalized.includes("network")
    );
  }, [error]);

  // get the greeting text based on the current time
  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  useEffect(() => {
    Animated.timing(scrollTopAnim, {
      toValue: showScrollTop ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [showScrollTop, scrollTopAnim]);

  // show the loading skeleton if the posts are still loading
  if (isLoading && posts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerWrap}>
          <View style={styles.topRow}>
            <View>
              <View style={styles.helloSkeleton} />
              <View style={styles.headlineSkeleton} />
            </View>
            <View style={styles.actionsWrap}>
              <View style={styles.iconSkeleton} />
              <View style={styles.iconSkeleton} />
            </View>
          </View>
          <View style={styles.searchSkeleton} />
        </View>
        <View style={styles.content}>
          {skeletonData.map((id) => (
            <SkeletonCard key={id} />
          ))}
        </View>
      </View>
    );
  }

  // show the offline error if the error is an offline error
  if (error && posts.length === 0) {
    if (isOfflineError) {
      return (
        <View style={styles.centered}>
          <View style={styles.offlineCard}>
            <Text style={styles.offlineTitle}>No Internet Connection</Text>
            <Text style={styles.offlineText}>
              Turn on your internet and try again. You can also open settings to
              connect quickly.
            </Text>
            <View style={styles.offlineActions}>
              <Button label="Try Again" onPress={refetch} />
              <HapticTouchable
                style={styles.settingsBtn}
                onPress={() => {
                  void Linking.openSettings();
                }}
              >
                <Text style={styles.settingsBtnText}>Open Settings</Text>
              </HapticTouchable>
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

  // show the empty state if there are no posts
  if (!isLoading && posts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>No posts found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrap}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.hello}>{greetingText}</Text>
            <Text style={styles.headline}>Explore Today</Text>
          </View>
          <View style={styles.actionsWrap}>
            <HapticTouchable
              style={styles.notifyWrap}
              onPress={() => {
                setIsSearchOpen((prev) => {
                  const next = !prev;
                  if (!next) {
                    setSearchQuery("");
                    Keyboard.dismiss();
                  }
                  return next;
                });
              }}
            >
              <SearchNormal1 size={20} color={colors.text} variant="Linear" />
            </HapticTouchable>
            <HapticTouchable
              style={styles.notifyWrap}
              onPress={() => navigation.navigate("Profile")}
            >
              <ProfileCircle size={20} color={colors.text} variant="Linear" />
            </HapticTouchable>
          </View>
        </View>
        <View
          style={[
            styles.searchAnimWrap,
            !isSearchOpen && styles.searchAnimWrapClosed,
          ]}
        >
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
                <CloseCircle
                  size={18}
                  color={colors.textSecondary}
                  variant="Bold"
                />
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>

      {/* Posts List */}
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
            onPress={() =>
              navigation.navigate("PostDetail", { postId: item.id })
            }
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

      {/* Scroll to top button */}
      <Animated.View
        pointerEvents={showScrollTop ? "auto" : "none"}
        style={[
          styles.toTopBtnWrap,
          {
            opacity: scrollTopAnim,
            transform: [
              {
                translateY: scrollTopAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
              {
                scale: scrollTopAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.92, 1],
                }),
              },
            ],
          },
        ]}
      >
        <HapticTouchable
          style={styles.toTopBtn}
          onPress={() => {
            listRef.current?.scrollToOffset({ offset: 0, animated: true });
          }}
        >
          <ArrowUp2 size={18} color="#FFFFFF" variant="Bold" />
        </HapticTouchable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: (StatusBar.currentHeight ?? 0) + spacing.xs,
  },
  list: {
    flex: 1,
  },
  content: {
    padding: spacing.sm,
    paddingBottom: spacing.xxl + spacing.lg,
  },
  headerWrap: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  actionsWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
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
  hello: {
    color: colors.textSecondary,
    fontWeight: "600",
  },
  headline: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
  },
  helloSkeleton: {
    height: 14,
    width: 110,
    borderRadius: 8,
    backgroundColor: colors.border,
    marginBottom: spacing.xs,
  },
  headlineSkeleton: {
    height: 34,
    width: 190,
    borderRadius: 10,
    backgroundColor: colors.border,
  },
  iconSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
  },
  searchSkeleton: {
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.border,
  },
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
    overflow: "hidden",
  },
  searchAnimWrapClosed: {
    maxHeight: 0,
    opacity: 0,
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
  empty: {
    color: colors.textSecondary,
  },
  error: {
    color: colors.error,
    marginBottom: spacing.md,
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  toTopBtnWrap: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.xl + spacing.lg,
  },
});

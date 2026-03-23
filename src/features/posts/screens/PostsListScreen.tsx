import { useMemo } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, LoadingSpinner } from "@components";
import { usePosts } from "@hooks";
import { colors, spacing } from "@theme";
import type { Post, PostsStackParamList } from "@types";
import { PostCard } from "../components/PostCard";
import { SkeletonCard } from "../components/SkeletonCard";

type Props = NativeStackScreenProps<PostsStackParamList, "PostsList">;

export const PostsListScreen = ({ navigation }: Props) => {
  const { posts, isLoading, error, refetch } = usePosts();
  const skeletonData = useMemo(() => [1, 2, 3], []);

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

  const getItemLayout = (_: unknown, index: number) => ({ length: 132, offset: 132 * index, index });

  return (
    <FlatList<Post>
      data={posts}
      style={styles.container}
      contentContainerStyle={styles.content}
      keyExtractor={(item) => item.id.toString()}
      getItemLayout={getItemLayout}
      renderItem={({ item }) => <PostCard post={item} onPress={() => navigation.navigate("PostDetail", { postId: item.id })} />}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />}
      ListFooterComponent={isLoading ? <LoadingSpinner message="Refreshing posts..." /> : null}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, padding: spacing.lg },
  empty: { color: colors.textSecondary },
  error: { color: colors.error, marginBottom: spacing.md }
});

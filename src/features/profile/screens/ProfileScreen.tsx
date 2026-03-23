import { Alert, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import Animated, { FadeInUp } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar, Button } from "@components";
import { useAuth } from "@hooks";
import { logout } from "@services";
import { colors, spacing } from "@theme";
import { formatDate } from "@utils";

export const ProfileScreen = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const likeKeys = keys.filter((k) => k.startsWith("likes_"));
      const commentKeys = keys.filter((k) => k.startsWith("comments_"));
      const likes = await AsyncStorage.multiGet(likeKeys);
      const comments = await AsyncStorage.multiGet(commentKeys);
      setLikedCount(likes.filter(([, v]) => v === "true").length);
      setCommentCount(
        comments.reduce((acc, [, value]) => {
          if (!value) return acc;
          try {
            return acc + (JSON.parse(value) as unknown[]).length;
          } catch {
            return acc;
          }
        }, 0)
      );
    };
    loadStats();
  }, []);

  const handleLogout = () => {
    Alert.alert("Confirm logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true);
          try {
            await logout();
          } finally {
            setIsLoading(false);
          }
        }
      }
    ]);
  };

  return (
    <Animated.View entering={FadeInUp.duration(260)} style={styles.container}>
      <Avatar name={user?.email ?? "User"} size="lg" />
      <Text style={styles.email}>{user?.email ?? "Unknown user"}</Text>
      <Text style={styles.meta}>Created: {user?.metadata.creationTime ? formatDate(user.metadata.creationTime) : "N/A"}</Text>
      <View style={styles.stats}>
        <Text style={styles.stat}>Liked posts: {likedCount}</Text>
        <Text style={styles.stat}>Comments added: {commentCount}</Text>
      </View>
      <Button label="Logout" onPress={handleLogout} loading={isLoading} variant="secondary" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", gap: spacing.sm, padding: spacing.lg },
  email: { color: colors.text, fontSize: 18, fontWeight: "700" },
  meta: { color: colors.textSecondary },
  stats: { marginVertical: spacing.lg, width: "100%", backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, gap: spacing.sm },
  stat: { color: colors.textSecondary }
});

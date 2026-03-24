import { Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import Animated, { FadeInUp } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft2, Heart, Logout, MessageText1 } from "iconsax-react-native";
import { Avatar, Button } from "@components";
import { useAuth } from "@hooks";
import { logout } from "@services";
import { colors, spacing } from "@theme";
import type { PostsStackParamList } from "@types";
import { formatDate } from "@utils";

type Props = NativeStackScreenProps<PostsStackParamList, "Profile">;

export const ProfileScreen = ({ navigation }: Props) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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

  const handleConfirmLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } finally {
      setIsLoading(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <Animated.View entering={FadeInUp.duration(260)} style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={20} color={colors.text} variant="Linear" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Profile</Text>
        <View style={styles.iconBtnPlaceholder} />
      </View>

      <View style={styles.profileCard}>
        <Avatar name={user?.email ?? "User"} size="lg" />
        <Text style={styles.email}>{user?.email ?? "Unknown user"}</Text>
        <Text style={styles.meta}>Joined: {user?.metadata.creationTime ? formatDate(user.metadata.creationTime) : "N/A"}</Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.section}>Your Activity</Text>
        <View style={styles.statRow}>
          <View style={styles.statIcon}>
            <Heart size={16} color={colors.error} variant="Bold" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Liked posts</Text>
            <Text style={styles.statValue}>{likedCount}</Text>
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={styles.statIcon}>
            <MessageText1 size={16} color={colors.primary} variant="Bold" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Comments added</Text>
            <Text style={styles.statValue}>{commentCount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionWrap}>
        <Button label="Logout" onPress={() => setShowLogoutModal(true)} loading={isLoading} variant="secondary" />
      </View>

      <Modal transparent animationType="fade" visible={showLogoutModal} onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Logout size={22} color={colors.error} variant="Bold" />
            </View>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowLogoutModal(false)} disabled={isLoading}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutBtn} onPress={handleConfirmLogout} disabled={isLoading}>
                <Text style={styles.logoutText}>{isLoading ? "Logging out..." : "Logout"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    gap: spacing.md,
    padding: spacing.sm,
    paddingTop: (StatusBar.currentHeight ?? 0) + spacing.md,
    justifyContent: "flex-start"
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center"
  },
  iconBtnPlaceholder: { width: 38, height: 38 },
  topTitle: { color: colors.text, fontSize: 18, fontWeight: "800" },
  profileCard: {
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: spacing.lg
  },
  email: { color: colors.text, fontSize: 18, fontWeight: "700", marginTop: spacing.xs },
  meta: { color: colors.textSecondary },
  section: { color: colors.text, fontWeight: "700", marginBottom: spacing.sm, fontSize: 16 },
  stats: { width: "100%", backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.sm },
  statRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: spacing.sm, backgroundColor: colors.background },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm
  },
  statContent: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  statLabel: { color: colors.textSecondary, fontWeight: "600" },
  statValue: { color: colors.text, fontWeight: "800", fontSize: 16 },
  actionWrap: { marginTop: spacing.sm },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg
  },
  modalCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg
  },
  modalIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(225, 29, 72, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm
  },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: "800", marginBottom: spacing.xs },
  modalText: { color: colors.textSecondary, marginBottom: spacing.md },
  modalActions: { flexDirection: "row", gap: spacing.sm },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: spacing.sm + 1,
    alignItems: "center"
  },
  cancelText: { color: colors.textSecondary, fontWeight: "700" },
  logoutBtn: {
    flex: 1,
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingVertical: spacing.sm + 1,
    alignItems: "center"
  },
  logoutText: { color: "#FFFFFF", fontWeight: "700" }
});

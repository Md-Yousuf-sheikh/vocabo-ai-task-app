import { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "@theme";
import { getInitials } from "@utils";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  uri?: string;
  name: string;
  size?: AvatarSize;
}

const sizeMap = {
  sm: 36,
  md: 52,
  lg: 72
} as const;

const AvatarComponent = ({ uri, name, size = "md" }: AvatarProps) => {
  const avatarSize = sizeMap[size];
  const initials = getInitials(name);

  return (
    <View style={[styles.base, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}>
      {uri ? <Image source={{ uri }} style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }} /> : <Text style={styles.initials}>{initials}</Text>}
    </View>
  );
};

export const Avatar = memo(AvatarComponent);

const styles = StyleSheet.create({
  base: { backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  initials: { color: colors.text, fontWeight: "700" }
});

import { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Comment } from "@types";
import { STORAGE_KEYS } from "@utils";

export const useLikeComment = (postId: number, initialLiked = false, initialComments: Comment[] = []) => {
  const [liked, setLiked] = useState(initialLiked);
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const likeKey = useMemo(() => `${STORAGE_KEYS.likesPrefix}${postId}`, [postId]);
  const commentKey = useMemo(() => `${STORAGE_KEYS.commentsPrefix}${postId}`, [postId]);

  useEffect(() => {
    const load = async () => {
      const storedLiked = await AsyncStorage.getItem(likeKey);
      const storedComments = await AsyncStorage.getItem(commentKey);
      if (storedLiked !== null) setLiked(storedLiked === "true");
      if (storedComments) setComments(JSON.parse(storedComments) as Comment[]);
    };
    load();
  }, [likeKey, commentKey]);

  const toggleLike = async () => {
    const next = !liked;
    setLiked(next);
    await AsyncStorage.setItem(likeKey, String(next));
  };

  const addComment = async (text: string) => {
    const next: Comment = {
      id: Date.now(),
      postId,
      text,
      createdAt: new Date().toISOString()
    };
    const merged = [...comments, next];
    setComments(merged);
    await AsyncStorage.setItem(commentKey, JSON.stringify(merged));
  };

  return { liked, toggleLike, comments, addComment };
};

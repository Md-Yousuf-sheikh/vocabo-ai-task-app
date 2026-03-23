import { useEffect, useState } from "react";
import type { Post } from "@types";
import { getCache, getPostById, setCache } from "@services";
import { STORAGE_KEYS } from "@utils";

export const usePostDetail = (postId: number) => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const key = `${STORAGE_KEYS.postPrefix}${postId}`;
        const cached = await getCache<Post>(key);
        if (cached) {
          setPost(cached);
          return;
        }
        const fresh = await getPostById(postId);
        setPost(fresh);
        await setCache(key, fresh);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch post");
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [postId]);

  return { post, isLoading, error };
};

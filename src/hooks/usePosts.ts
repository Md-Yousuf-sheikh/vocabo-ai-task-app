import { useCallback, useEffect, useState } from "react";
import { getCache, getPosts, setCache } from "@services";
import { STORAGE_KEYS } from "@utils";
import type { Post } from "@types";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setError(null);
    try {
      const cached = await getCache<Post[]>(STORAGE_KEYS.postsCache);
      if (cached) {
        setPosts(cached);
        return;
      }
      const fresh = await getPosts();
      setPosts(fresh);
      await setCache(STORAGE_KEYS.postsCache, fresh);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const fresh = await getPosts();
      setPosts(fresh);
      await setCache(STORAGE_KEYS.postsCache, fresh);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh posts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { posts, isLoading, error, refetch };
};

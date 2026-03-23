export const API_BASE_URL = "https://jsonplaceholder.typicode.com" as const;
export const CACHE_TTL_MS = 5 * 60 * 1000;

export const STORAGE_KEYS = {
  postsCache: "posts",
  postPrefix: "post_",
  likesPrefix: "likes_",
  commentsPrefix: "comments_"
} as const;

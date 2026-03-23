import { apiRequest } from "./api.client";
import type { Post } from "@types";

export const getPosts = (): Promise<Post[]> => {
  return apiRequest<Post[]>("/posts");
};

export const getPostById = (id: number): Promise<Post> => {
  return apiRequest<Post>(`/posts/${id}`);
};

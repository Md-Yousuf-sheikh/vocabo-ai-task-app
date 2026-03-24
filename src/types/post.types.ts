export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface Comment {
  id: number;
  postId: number;
  text: string;
  createdAt: string;
}

export interface PostWithMeta extends Post {
  liked: boolean;
  comments: Comment[];
}

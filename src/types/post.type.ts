export interface PostUser {
  _id: string;
  name: string;
  username?: string;
  email?: string;
  photo?: string;
  cover?: string;
}

export interface PostComment {
  _id: string;
  content: string;
  commentCreator: PostUser;
  post: string;
  createdAt: string;
  likes?: string[];
}

export interface Post {
  _id: string;
  id?: string;
  body: string;
  image?: string;
  privacy?: "public" | "private" | "followers";
  user: PostUser;
  sharedPost?: Post | null;
  likes: string[];
  likesCount?: number;
  commentsCount?: number;
  topComment?: PostComment | null;
  createdAt: string;
  sharesCount?: number;
  isShare?: boolean;
  bookmarked?: boolean;
}

export interface PaginationInfo {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  total?: number;
}

export interface PostsApiResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    paginationInfo?: PaginationInfo;
  };
}

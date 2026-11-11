import axios from "axios";
import type { Post } from "../types/post";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

const POSTS_PER_PAGE = 8;

type NewPostData = Pick<Post, "title" | "body">;
type EditPostData = Pick<Post, "id" | "title" | "body">;

interface FetchPostsResponse {
  posts: Post[];
  totalPages: number;
}

export const fetchPosts = async (searchText: string, page: number): Promise<FetchPostsResponse> => {
  const { data, headers } = await axios.get<Post[]>("/posts", {
    params: {
      q: searchText,
      _page: page,
      _limit: POSTS_PER_PAGE,
    },
  });

  const totalCount = Number(headers["x-total-count"]);

  return {
    posts: data,
    totalPages: Math.ceil(totalCount / POSTS_PER_PAGE),
  };
};

export const createPost = async (newPost: NewPostData): Promise<Post> => {
  const { data } = await axios.post<Post>("/posts", newPost);

  return data;
};

export const editPost = async (newDataPost: EditPostData): Promise<Post> => {
  const { id, title, body } = newDataPost;

  const { data } = await axios.patch<Post>(`/posts/${id}`, {
    title,
    body,
  });

  return data;
};

export const deletePost = async (postId: number): Promise<void> => {
  await axios.delete(`/posts/${postId}`);
};

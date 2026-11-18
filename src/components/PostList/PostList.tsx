import css from "./PostList.module.css";
import type { Post } from "../../types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../../services/postService";

interface PostListProps {
  posts: Post[];
  toggleModal: () => void;
  toggleEditPost: (post: Post) => void;
}

export default function PostList({ posts, toggleModal, toggleEditPost }: PostListProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      alert("Post deleted successfully!");
    },
  });

  return (
    <ul className={css.list}>
      {posts.map((post) => (
        <li className={css.listItem} key={post.id}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button
              className={css.edit}
              onClick={() => {
                toggleEditPost(post);
                toggleModal();
              }}
            >
              Edit
            </button>
            <button
              className={css.delete}
              type="button"
              onClick={() => {
                mutate(post.id);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

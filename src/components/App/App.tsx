import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import type { Post } from "../../types/post";
import { fetchPosts } from "../../services/postService";

import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import EditPostForm from "../EditPostForm/EditPostForm";

import css from "./App.module.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);

  const [editedPost, setEditedPost] = useState<Post | null>(null);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearchQuery(value);
    setCurrentPage(1);
  }, 300);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", debouncedSearchQuery, currentPage],
    queryFn: () => fetchPosts(debouncedSearchQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  const posts = data?.posts ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleCreatePost = () => {
    setIsCreatePost(true);
    setIsEditPost(false);
    setEditedPost(null);
    setIsModalOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setIsEditPost(true);
    setIsCreatePost(false);
    setEditedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsCreatePost(false);
    setIsEditPost(false);
    setEditedPost(null);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onSearch={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={handleCreatePost}>
          Create post
        </button>
      </header>

      {isLoading && <p>Loading posts...</p>}

      {isError && <p>Something went wrong. Please try again.</p>}

      {!isLoading && !isError && posts.length === 0 && <p>No posts found.</p>}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          {isCreatePost && <CreatePostForm onClose={handleCloseModal} />}

          {isEditPost && editedPost && (
            <EditPostForm post={editedPost} onClose={handleCloseModal} />
          )}
        </Modal>
      )}
      {!isLoading && !isError && posts.length > 0 && (
        <PostList
          posts={posts}
          toggleModal={() => setIsModalOpen(true)}
          toggleEditPost={handleEditPost}
        />
      )}
    </div>
  );
}

import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { editPost } from "../../services/postService";
import type { Post } from "../../types/post";

import css from "./EditPostForm.module.css";

interface EditPostFormProps {
  post: Pick<Post, "id" | "title" | "body">;
  onClose: () => void;
}

type EditPostValues = Pick<Post, "title" | "body">;

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must not exceed 50 characters")
    .required("Title is required"),
  body: Yup.string()
    .max(500, "Content must not exceed 500 characters")
    .required("Content is required"),
});

export default function EditPostForm({ post, onClose }: EditPostFormProps) {
  const queryClient = useQueryClient();

  const editPostMutation = useMutation({
    mutationFn: editPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      alert("Post edited successfully!");
      onClose();
    },
  });

  const handleSubmit = async (values: EditPostValues) => {
    try {
      await editPostMutation.mutateAsync({
        id: post.id,
        ...values,
      });
    } catch (error) {
      console.error("Failed to edit post:", error);
    }
  };

  return (
    <Formik
      initialValues={{
        title: post.title,
        body: post.body,
      }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ isValid, dirty }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="body">Content</label>
            <Field id="body" as="textarea" name="body" rows={8} className={css.textarea} />
            <ErrorMessage name="body" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={!isValid || !dirty || editPostMutation.isPending}
            >
              Edit post
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

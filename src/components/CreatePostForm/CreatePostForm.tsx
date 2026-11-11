import * as Yup from "yup";
import { Field, Form, Formik, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPost } from "../../services/postService";

import css from "./CreatePostForm.module.css";

interface CreatePostFormProps {
  onClose: () => void;
}

interface CreatePostValues {
  title: string;
  body: string;
}

const initialValues: CreatePostValues = {
  title: "",
  body: "",
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must not exceed 50 characters")
    .required("Title is required"),
  body: Yup.string()
    .max(500, "Content must not exceed 500 characters")
    .required("Content is required"),
});

export default function PostForm({ onClose }: CreatePostFormProps) {
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      alert("Post created successfully!");
    },
  });

  const handleSubmit = async (
    values: CreatePostValues,
    actions: FormikHelpers<CreatePostValues>
  ) => {
    try {
      await createPostMutation.mutateAsync(values);

      actions.resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
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
              disabled={!isValid || !dirty || createPostMutation.isPending}
            >
              Create post
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

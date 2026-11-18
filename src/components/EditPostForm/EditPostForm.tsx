import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { editPost } from "../../services/postService";
import type { Post } from "../../types/post";

import css from "./EditPostForm.module.css";

interface EditPostFormProps {
  initialValues: Post;
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must not exceed 50 characters")
    .required("Title is required"),
  body: Yup.string()
    .max(500, "Content must not exceed 500 characters")
    .required("Content is required"),
});

export default function EditPostForm({ initialValues, onClose }: EditPostFormProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: editPost,
    onSuccess: ({ title }) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      alert(`${title}Post edited successfully!`);
      onClose();
    },
  });

  const handleSubmit = (values: Post) => {
    mutate(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
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
          <button type="submit" className={css.submitButton} disabled={isPending}>
            Edit post
          </button>
        </div>
      </Form>
    </Formik>
  );
}

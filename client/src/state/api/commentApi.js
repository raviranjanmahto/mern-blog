import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../utils/baseQuery";

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery,
  endpoints: builder => ({
    getComments: builder.query({
      query: () => `comment/get-all-comments`,
    }),

    createComment: builder.mutation({
      query: ({ blogId, newComment }) => ({
        url: `comment/post-comment/${blogId}`,
        method: "POST",
        body: newComment,
      }),
    }),

    deleteComment: builder.mutation({
      query: ({ blogId, commentId }) => ({
        url: `comment/${blogId}/comments/${commentId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;

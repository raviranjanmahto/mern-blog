import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../utils/baseQuery";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery,
  endpoints: builder => ({
    getAllBlogs: builder.query({
      query: () => "blog/get-blog",
    }),

    getBlogDetails: builder.query({
      query: id => `blog/get-blog/${id}`,
    }),

    getRelatedBlogs: builder.query({
      query: id => `blog/get-related-blog/${id}`,
    }),

    createBlog: builder.mutation({
      query: newBlog => ({
        url: "blog/post-blog",
        method: "POST",
        body: newBlog,
      }),
    }),

    updateBlog: builder.mutation({
      query: ({ id, ...update }) => ({
        url: `blog/update-blog/${id}`,
        method: "PATCH",
        body: update,
      }),
    }),

    deleteBlog: builder.mutation({
      query: id => ({
        url: `blog/delete-blog/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetBlogDetailsQuery,
  useGetRelatedBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;

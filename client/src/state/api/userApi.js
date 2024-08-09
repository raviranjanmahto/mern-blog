import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../utils/baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  endpoints: builder => ({
    auth: builder.query({
      query: () => "auth/verify-token",
    }),

    login: builder.mutation({
      query: credentials => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    signup: builder.mutation({
      query: newUser => ({
        url: "auth/signup",
        method: "POST",
        body: newUser,
      }),
    }),

    getMe: builder.query({
      query: () => "auth/get-me",
    }),
  }),
});

export const {
  useAuthQuery,
  useLoginMutation,
  useSignupMutation,
  useGetMeQuery,
} = userApi;

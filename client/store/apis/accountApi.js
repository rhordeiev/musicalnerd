import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const accountApi = createApi({
  reducerPath: 'accountApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_URL}/account/`,
  }),
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
    }),
    changeUser: builder.mutation({
      query: (body) => ({
        url: '/',
        method: 'PUT',
        body,
      }),
    }),
    deleteUser: builder.mutation({
      query: (login) => ({
        url: `/${login}`,
        method: 'DELETE',
      }),
    }),
    likeReview: builder.mutation({
      query: ({ id, userLogin }) => ({
        url: `/${userLogin}/like/${id}`,
        method: 'POST',
      }),
    }),
    dislikeReview: builder.mutation({
      query: ({ id, userLogin }) => ({
        url: `/${userLogin}/dislike/${id}`,
        method: 'DELETE',
      }),
    }),
    loginUser: builder.mutation({
      query: (body) => ({
        url: 'login',
        method: 'POST',
        body,
      }),
    }),
    findUser: builder.query({
      query: ({ login, role }) => ({
        url: `?login=${login}&role=${role}`,
      }),
    }),
    writeMessage: builder.mutation({
      query: (body) => ({
        url: 'message',
        method: 'POST',
        body,
      }),
    }),
    deleteMessage: builder.mutation({
      query: (body) => ({
        url: 'message',
        method: 'DELETE',
        body,
      }),
    }),
    search: builder.query({
      query: ({ type, value, limit, offset }) => ({
        url: `/search?type=${type}&value=${value}&limit=${limit}&offset=${offset}`,
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useChangeUserMutation,
  useDeleteUserMutation,
  useLoginUserMutation,
  useLazyFindUserQuery,
  useWriteMessageMutation,
  useLazySearchQuery,
  useLikeReviewMutation,
  useDislikeReviewMutation,
  useDeleteMessageMutation,
} = accountApi;

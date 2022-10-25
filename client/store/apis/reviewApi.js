import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_URL}/review/`,
  }),
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
    }),
    getReview: builder.query({
      query: ({ id }) => ({
        url: `/${id}`,
      }),
    }),
    findReviews: builder.query({
      query: ({
        type,
        id,
        offset,
        filterColumn = 'none',
        filterValue = 'none',
        sort = 'none',
        direction = 'none',
      }) => ({
        url: `?type=${type}&id=${id}&offset=${offset}&filterColumn=${filterColumn}&filterValue=${filterValue}&sort=${sort}&direction=${direction}`,
      }),
    }),
    getLikes: builder.query({
      query: ({ id }) => ({
        url: `/${id}/likes`,
      }),
    }),
    changeReview: builder.mutation({
      query: (body) => ({
        url: '/',
        method: 'PUT',
        body,
      }),
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useLazyFindReviewsQuery,
  useLazyGetLikesQuery,
  useLazyGetReviewQuery,
  useChangeReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;

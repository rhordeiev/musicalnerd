import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const albumApi = createApi({
  reducerPath: 'albumApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_URL}/album/`,
  }),
  endpoints: (builder) => ({
    createAlbum: builder.mutation({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
    }),
    changeAlbum: builder.mutation({
      query: (body) => ({
        url: '/',
        method: 'PUT',
        body,
      }),
    }),
    deleteAlbum: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
    findAlbum: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
    }),
    getMark: builder.query({
      query: (id) => ({
        url: `/${id}/mark`,
      }),
    }),
    getReactions: builder.query({
      query: (id) => ({
        url: `/${id}/reactions`,
      }),
    }),
    getPopularAlbums: builder.query({
      query: () => ({
        url: '/popular',
      }),
    }),
    getNearestAlbums: builder.query({
      query: () => ({
        url: '/nearest',
      }),
    }),
  }),
});

export const {
  useCreateAlbumMutation,
  useChangeAlbumMutation,
  useDeleteAlbumMutation,
  useLazyFindAlbumQuery,
  useLazyGetMarkQuery,
  useLazyGetReactionsQuery,
  useLazyGetPopularAlbumsQuery,
  useLazyGetNearestAlbumsQuery,
} = albumApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const artistApi = createApi({
  reducerPath: 'artistApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_URL}/artist/`,
  }),
  endpoints: (builder) => ({
    createArtist: builder.mutation({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
    }),
    changeArtist: builder.mutation({
      query: (body) => ({
        url: '/',
        method: 'PUT',
        body,
      }),
    }),
    deleteArtist: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
    findArtist: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
    }),
    findArtistAlbums: builder.query({
      query: (id) => ({
        url: `/${id}/albums`,
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
    getPopularArtists: builder.query({
      query: () => ({
        url: '/popular',
      }),
    }),
  }),
});

export const {
  useCreateArtistMutation,
  useChangeArtistMutation,
  useDeleteArtistMutation,
  useLazyFindArtistQuery,
  useLazyFindArtistAlbumsQuery,
  useLazyGetMarkQuery,
  useLazyGetReactionsQuery,
  useLazyGetPopularArtistsQuery,
} = artistApi;

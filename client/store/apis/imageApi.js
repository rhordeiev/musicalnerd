/* eslint-disable indent */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_URL}/image/`,
  }),
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      async queryFn(data) {
        const formData = new FormData();
        formData.append('image', data.image);
        const response = await fetch(`${process.env.API_URL}/image/`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          const message = `An error has occured: ${response.status}`;
          throw new Error(message);
        }
        const result = await response.json();
        return result;
      },
    }),
    removeImage: builder.mutation({
      query: (avatar) => ({
        url: `/${avatar}`,
        method: 'DELETE',
      }),
    }),
    getImage: builder.query({
      query: (avatar) => ({
        url: `/${avatar}`,
      }),
    }),
  }),
});

export const {
  useUploadImageMutation,
  useRemoveImageMutation,
  useLazyGetImageQuery,
} = imageApi;

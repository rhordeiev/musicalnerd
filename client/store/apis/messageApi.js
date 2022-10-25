import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const messageApi = createApi({
  reducerPath: 'messageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_URL}/message/`,
  }),
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: ({ type, id }) => ({
        url: `?type=${type}&id=${id}`,
      }),
    }),
  }),
});

export const { useLazyGetMessagesQuery } = messageApi;

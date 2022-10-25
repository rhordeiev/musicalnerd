import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './slices/userSlice';
import { accountApi } from './apis/accountApi';
import { imageApi } from './apis/imageApi';
import { artistApi } from './apis/artistApi';
import { albumApi } from './apis/albumApi';
import { reviewApi } from './apis/reviewApi';
import { messageApi } from './apis/messageApi';

const rootReducer = combineReducers({
  user: userReducer,
  [accountApi.reducerPath]: accountApi.reducer,
  [imageApi.reducerPath]: imageApi.reducer,
  [artistApi.reducerPath]: artistApi.reducer,
  [albumApi.reducerPath]: albumApi.reducer,
  [reviewApi.reducerPath]: reviewApi.reducer,
  [messageApi.reducerPath]: messageApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    accountApi.reducerPath,
    imageApi.reducerPath,
    artistApi.reducerPath,
    albumApi.reducerPath,
    reviewApi.reducerPath,
    messageApi.reducerPath,
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      accountApi.middleware,
      imageApi.middleware,
      artistApi.middleware,
      albumApi.middleware,
      reviewApi.middleware,
      messageApi.middleware,
    ),
});
export const persistor = persistStore(store);

setupListeners(store.dispatch);

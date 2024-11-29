import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import authReducer from '../../feauter/slices/auth/authSlice';
import productSlice from '../../feauter/slices/product/productSlice';
import otherProfileSlice from '../../feauter/slices/otherProfile/otherProfileSlice';
import cartSlice from '../../feauter/slices/product/cartSlice';
import categotiesSlice from '../../feauter/slices/admin/categotiesSlice';
const rootReducer = combineReducers({
  auth: authReducer,
  products: productSlice,
  otherProfle:otherProfileSlice,
  cart:cartSlice,
  categories:categotiesSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production', // Automatically enable Redux DevTools in development
});

export const persistor = persistStore(store);

export default store;
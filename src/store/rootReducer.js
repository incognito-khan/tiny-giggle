import { combineReducers } from '@reduxjs/toolkit';
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import authReducer from './slices/authSlice';
import childReducer from './slices/childSlice';
import vacciReducer from './slices/vaccinationSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import mediaReducer from './slices/mediaSlice';
import milestoneReducer from './slices/milestoneSlice';
import chatReducer from './slices/chatSlice';
import messageReducer from './slices/messageSlice';
import musicReducer from './slices/musicSlice';
import favoriteReducer from './slices/favoriteSlice';
import folderReducer from './slices/folderSlice';
import growthReducer from './slices/growthSlice';
import relationReducer from './slices/relationSlice';

// const authPersistConfig = {
//   key: "auth",
//   storage,
// };

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "child", "favorite", "folder"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  child: childReducer,
  vaccination: vacciReducer,
  product: productReducer,
  category: categoryReducer,
  media: mediaReducer,
  milestone: milestoneReducer,
  chat: chatReducer,
  message: messageReducer,
  music: musicReducer,
  favorite: favoriteReducer,
  folder: folderReducer,
  growth: growthReducer,
  relation: relationReducer,
});

export default persistReducer(rootPersistConfig, rootReducer);;
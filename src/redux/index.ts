// // redux/slice/userSlice.ts
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: null,
//   token: null,
//   isLoggedIn: false,
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       state.user = action.payload; // { userId: "..." }
//       state.isLoggedIn = true; // Optional: set login to true when user is set
//     },
//     setToken: (state, action) => {
//       state.token = action.payload;
//     },
//     setLogin: (state) => {
//       state.isLoggedIn = true;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isLoggedIn = false;
//     },
//   },
// });

// export const { setUser, setToken, setLogin, logout } = userSlice.actions;
// export default userSlice.reducer;
// redux/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import userReducer from "./slice/userSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

// Optional: for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

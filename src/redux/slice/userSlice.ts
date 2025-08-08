import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  userId: string;
  email: string;
}

interface UserState {
  user: User | null; 
  token: string;
  isLogin: boolean;
  fcmToken: string;
}

const initialState: UserState = {
  user: null,
  token: "",
  isLogin: false,
  fcmToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user || null;
      state.token = action.payload.token || "";
      state.isLogin = true;
    },

    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload || null;
      state.isLogin = !!action.payload; 
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload || "";
    },

    setLogout: (state) => {
      state.user = null;
      state.isLogin = false;
      state.token = "";
      state.fcmToken = ""; 
    },

    setFcmToken: (state, action: PayloadAction<string>) => {
      state.fcmToken = action.payload;
    },
  },
});

export const { setLogin, setUser, setToken, setLogout, setFcmToken } = userSlice.actions;
export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  userLoggedIn: false,
  userID: "",
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleLoading: (state, action) => {
      state.loading = action.payload;
      console.log("Loading: ", state.loading);
    },
    toggleUserLoggedIn: (state, action) => {
      state.userLoggedIn = action.payload;
    },
    updateUserDetails: (state, action) => {
      state.userID = action.payload.id;
      state.userName = action.payload.name;
    },
  }
});

export const { toggleLoading, toggleUserLoggedIn, updateUserDetails } = authSlice.actions;
export default authSlice.reducer;
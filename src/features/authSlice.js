import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  userLoggedIn: false,
  userID: "",
  loading: false,
  commentsArr: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleLoading: (state, action) => {
      state.loading = action.payload;
    },
    toggleUserLoggedIn: (state, action) => {
      state.userLoggedIn = action.payload;
    },
    updateUserDetails: (state, action) => {
      state.userID = action.payload.id;
      state.userName = action.payload.name;
    },
    updatecommentsArr: (state, action) => {
      state.commentsArr = action.payload;
    },
    addcommentsArr: (state, action) => {
      console.log("Action.payload: ", action.payload);
      const newItem = action.payload;
      return {
        ...state,
        commentsArr: [...state.commentsArr, newItem],
      }
    },
    delCommentsArr: (state, action) => {
      
    },
  }
});

export const { toggleLoading, toggleUserLoggedIn, updateUserDetails, updatecommentsArr, addcommentsArr } = authSlice.actions;
export default authSlice.reducer;
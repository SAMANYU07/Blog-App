import { createSlice } from "@reduxjs/toolkit";


const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];
const dt = new Date();
var tdate = dt.getDate() + " " + monthNames[dt.getMonth()] + " " + dt.getFullYear();

const initialState = {
  userName: "",
  userLoggedIn: false,
  userID: "",
  loading: false,
  commentsArr: [],
  date: tdate,
  guestUser: false,
  clearData: false,
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
    toggleGuestUser: (state, action) => {
      state.guestUser = action.payload;
    },
    toggleClearData: (state, action) => {
      state.clearData = action.payload;
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

export const { toggleLoading, toggleUserLoggedIn, toggleGuestUser, toggleClearData, updateUserDetails, updatecommentsArr, addcommentsArr } = authSlice.actions;
export default authSlice.reducer;
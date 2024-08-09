import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isAuthenticated: false,
  },
  reducers: {
    // Set the credentials in the Redux store
    setCredentials: (state, action) => {
      state.currentUser = action.payload.user;
      state.isAuthenticated = true;
    },
    // Clear the user data and access token
    logout: state => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = userSlice.actions;

export default userSlice.reducer;

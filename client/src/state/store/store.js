import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query"; // Import setupListeners to enable automatic refetching

import { userApi } from "../api/userApi"; // Import the RTK Query API slice for user-related data
import { blogApi } from "../api/blogApi"; // Import the RTK Query API slice for blog-related data
import { commentApi } from "../api/commentApi"; // Import the RTK Query API slice for comment-related data
import userReducer from "../slices/userSlice"; // Import the user slice reducer for managing user-related state
import blogReducer from "../slices/blogSlice"; // Import the blog slice reducer for managing blog-related state
import commentReducer from "../slices/commentSlice"; // Import the comment slice reducer for managing comment-related state

// Create and configure the Redux store
const store = configureStore({
  reducer: {
    // Add slice reducers to the store
    user: userReducer, // Reducer for managing user-related state
    blog: blogReducer, // Reducer for managing blog-related state
    comment: commentReducer, // Reducer for managing comment-related state

    // Add RTK Query API reducers
    [userApi.reducerPath]: userApi.reducer, // Reducer for handling user API endpoints
    [blogApi.reducerPath]: blogApi.reducer, // Reducer for handling blog API endpoints
    [commentApi.reducerPath]: commentApi.reducer, // Reducer for handling comment API endpoints
  },

  // Add middleware for RTK Query and any other necessary middleware
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      userApi.middleware, // Middleware for handling user API requests
      blogApi.middleware, // Middleware for handling blog API requests
      commentApi.middleware // Middleware for handling comment API requests
    ),
});

// Setup listeners to enable automatic refetching of data when relevant actions are dispatched
setupListeners(store.dispatch);

export default store; // Export the configured store for use in the application

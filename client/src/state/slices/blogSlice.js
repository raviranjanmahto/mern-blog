import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // Define any synchronous actions here if needed
  },
});

export default blogSlice.reducer;

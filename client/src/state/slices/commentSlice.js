import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    comments: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // Define any synchronous actions here if needed
  },
});

export default commentSlice.reducer;

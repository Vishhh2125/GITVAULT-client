import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api.js";

const getfileContent = createAsyncThunk(
  "filecontent/getfileContent",
  async ({ repoId, path, ref = "main" }, { rejectWithValue }) => {
    try {
      const response = await api.get(`repos/${repoId}/file`, {
        params: {
          path,
          ref,
        },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "something went wrong"
      );
    }
  }
);

const filecontentSlice = createSlice({
  name: "filecontent",
  initialState: {
    content: "",
    path: null,
    ref: "main",
    status: "idle",
    error: null,
  },
  reducers: {
    resetFileContent: (state) => {
      state.content = "";
      state.path = null;
      state.ref = "main";
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getfileContent.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getfileContent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.content = action.payload?.content || "";
        state.path = action.payload?.path || null;
        state.ref = action.payload?.ref || "main";
      })
      .addCase(getfileContent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetFileContent } = filecontentSlice.actions;
export { getfileContent };
export default filecontentSlice.reducer;
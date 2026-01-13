import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import api from "../api/api.js";



const getFileTree = createAsyncThunk(
    "fileTree/getFileTree",
    async({repoId, path = '/', ref = 'main'}, {rejectWithValue}) => {
        try {
            console.log("Fetching file tree for repo:", repoId, "path:", path, "ref:", ref);
            // Pass path and ref as query parameters
            const response = await api.get(`repos/${repoId}/tree`, {
                params: {
                    path: path,
                    ref: ref
                }
            });
            
            return response.data.data;
            
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "something went wrong"
            )
        }
    }
)





const fileTreeSlice = createSlice({
    name: 'fileTree',
    initialState: {
        tree: [],
        currentPath: '/',
        currentRef: 'main',
        status: "idle",
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetTree: (state) => {
            state.tree = [];
            state.currentPath = '/';
            state.status = "idle";
            state.error = null;
        },
       
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFileTree.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getFileTree.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.tree = action.payload.items;
                state.currentPath = action.payload.path;
                state.error = null;
            })
            .addCase(getFileTree.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
                state.tree = [];
            })
    }
})

export { getFileTree };
export const { clearError, resetTree } = fileTreeSlice.actions;
export default fileTreeSlice.reducer;
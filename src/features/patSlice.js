import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
import api from "../api/api.js";

 const getPatTokens = createAsyncThunk(
  "pat/getPatTokens",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/pat/myPats");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

 const deletePAT = createAsyncThunk(
  "pat/deletePAT",
  async (patId, { rejectWithValue }) => {
    try {
      await api.delete(`/pat/${patId}`);
      return patId; // ✅ IMPORTANT
    } catch (error) {
      return rejectWithValue(
        error.response?.message || error.message || "Something went wrong"
      );
    }
  }
);


const createPat=createAsyncThunk(
    "pat/createPAT",
    async(label,{rejectWithValue})=>{
        try {
            const response = await api.post("/pat/create",{label});
            return response.data.data;
            
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Something went wrong"
            )
            
        }
    }
)


     


      
const patSlice = createSlice({
  name: "pat",
  initialState: {
    tokens: [],

    // GET (page-level)
    status: "idle",        // idle | loading | success | error
    error: null,

    // DELETE (row-level)
    deletingId: null,
    actionError: null,
    //create 
    creating:false,
    createError:null,

  },
  reducers: {
    resetPatStatus:(state )=>{

        state.status="idle"
    },
    clearErrors(state) {
      state.error = null
      state.actionError = null
      state.createError = null
    }
  },
  extraReducers: (builder) => {
    builder

      // ================= GET =================
      .addCase(getPatTokens.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.actionError = null,
        state.createError = null,
        state.creating=false,
        state.deletingId= null

      })
      .addCase(getPatTokens.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tokens = action.payload;
         
      })
      .addCase(getPatTokens.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        
        
      })

      // ================= DELETE =================
      .addCase(deletePAT.pending, (state, action) => {
        state.deletingId = action.meta.arg;   // 👈 row loading
        state.actionError = null
        state.creating=false,
        state.createError = null
        state.error = null;
        
      })
      .addCase(deletePAT.fulfilled, (state, action) => {
        state.tokens = state.tokens.filter(
          token => token._id !== action.payload
        );
        state.deletingId = null;
        state.actionError = null;
        
      })
      .addCase(deletePAT.rejected, (state, action) => {
        state.deletingId = null;
        state.actionError = {
          id: action.meta.arg,
          message: action.payload
        };
      })

      // ================= CREATE =================
      .addCase(createPat.pending,(state,action)=>{
        state.creating=true;
        state.createError=null;
        state.error = null;
        state.deletingId= null;
        state.actionError = null;
    })
    .addCase(createPat.fulfilled,(state,action)=>{
        state.creating=false;
        state.tokens.push(action.payload);
        state.createError=null;
    })
    .addCase(createPat.rejected,(state,action)=>{
        state.creating=false;
        state.createError={
            id:action.meta.arg,
          message:  action.payload
        }
    });
    
  }
});

export default patSlice.reducer;
export const {resetPatStatus,clearErrors}=patSlice.actions
export { getPatTokens, deletePAT, createPat };

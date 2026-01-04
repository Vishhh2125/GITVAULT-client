import {createSlice ,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../api/api.js';



const getRepos= createAsyncThunk(
    "repos/getRepos",
    async(_, { rejectWithValue })=>{

        try {

            const response = await api.get("repos/all");

            return response.data;
            
        } catch (error) {
            console.log("Error fetching repositories:", error);

           return rejectWithValue(
            error.response?.message || error.message  || "Something went wrong"
           )
            
        }
    }
)


   




const repoSlice= createSlice({
    name:"repos",
    initialState:{
        repos:[],
        status:"idle",
        error:null
    },
    reducers:{
        resetRepoStatus:(state)=>{
            state.status="idle";

        }
    }
    ,
    extraReducers:(builder)=>{
        builder
            .addCase(getRepos.fulfilled,(state,action)=>{
                state.repos=action.payload.data;
                state.status="succeeded";
                state.error=null;
            })
            .addCase(getRepos.pending,(state,action)=>{
                state.status="loading";
                state.error=null;
            })
            .addCase(getRepos.rejected,(state,action)=>{
                state.status="failed";
                state.error=action.payload;
            })



        
    }
})



export {    getRepos};
export default repoSlice.reducer;
export const {resetRepoStatus}=repoSlice.actions;
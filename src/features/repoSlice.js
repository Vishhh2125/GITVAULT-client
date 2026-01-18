import {createSlice ,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../api/api.js';



const getRepos= createAsyncThunk(
    "repos/getRepos",
    async(_, { rejectWithValue })=>{

        try {

            const response = await api.get("repos/my");

            return response.data;
            
        } catch (error) {
            console.log("Error fetching repositories:", error);

           return rejectWithValue(
            error.response?.message || error.message  || "Something went wrong"
           )
            
        }
    }
)


const createRepo=createAsyncThunk(
    "repos/createRepo",
    async(data,{rejectWithValue})=>{
        try {
            const response = await api.post("/repos/create",data);
            return response.data.data;
        } catch (error) {
            console.log("Error creating repository:", error);
            console.log("Error response:", error.response?.data);
            return rejectWithValue(
                error.response?.data?.message || error.message || "Something went wrong"
            )
        }
    }
);

const getRepoInfo = createAsyncThunk(
    "repos/getRepoInfo",
    async(repoId, {rejectWithValue}) => {
        try {
            const response = await api.get(`/repos/${repoId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Something went wrong"
            );
        }
    }
);

const updateRepo = createAsyncThunk(
    "repos/updateRepo",
    async({repoId, data}, {rejectWithValue}) => {
        try {
            const response = await api.put(`/repos/${repoId}`, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Something went wrong"
            );
        }
    }
);

const deleteRepo = createAsyncThunk(
    "repos/deleteRepo",
    async(repoId, {rejectWithValue}) => {
        try {
            await api.delete(`/repos/${repoId}`);
            return repoId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Something went wrong"
            );
        }
    }
);



const getAllPublicRepos=createAsyncThunk(
    "repos/getAllPublicRepos",
    async(_,{rejectWithValue})=>{
        try {

            const reponse = await api.get("/repos/public");
            return reponse.data.data;
            
        } catch (error) {
            rejectWithValue(
                error.response?.data?.message || error.message || "Something went wrong"
            )
            
        }
    }
)


   




const repoSlice= createSlice({
    name:"repos",
    initialState:{
        repos:[],
        currentRepo: null,
        status:"idle",
        error:null,
        //creating state
        creating:false,
        creatingError:null,
        //repo info state
        repoInfoStatus: "idle",
        repoInfoError: null,
        //updating state
        updating: false,
        updateError: null,
        //deleting state
        deleting: false,
        deleteError: null,

        publicRepos:[],
        publicReposStatus:"idle",
        publicReposError:null,
    },
    reducers:{
        resetRepos:(state)=>{
            state.repos=[];
            state.status="idle";
            state.error=null;
            state.creating=false;
            state.creatingError=null;
            state.repoInfoStatus="idle";
            state.repoInfoError=null;
            state.updating=false;
            state.updateError=null;
            state.deleting=false;
            state.deleteError=null;
            state.currentRepo=null;

        },
        resetRepoInfo:(state)=>{
            state.currentRepo=null;
            state.repoInfoStatus="idle";
            state.repoInfoError=null;
        },
        resetPublicRepos:(state)=>{
            state.publicRepos=[];
            state.publicReposStatus="idle";
            state.publicReposError=null;
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
            //creatinng repo 
            .addCase(createRepo.pending,(state)=>{
                state.creating=true;
                state.creatingError=null;
                state.error=null;
            })
            .addCase(createRepo.fulfilled,(state,action)=>{
                
                state.creating=false;
                state.repos.push(action.payload);
                state.creatingError=null;
            })
            .addCase(createRepo.rejected,(state,action)=>{
                state.creating=false;
                state.creatingError=action.payload;
            })
            // Get Repo Info
            .addCase(getRepoInfo.pending,(state)=>{
                state.repoInfoStatus="loading";
                state.repoInfoError=null;
            })
            .addCase(getRepoInfo.fulfilled,(state,action)=>{
                state.repoInfoStatus="succeeded";
                state.currentRepo=action.payload;
                state.repoInfoError=null;
            })
            .addCase(getRepoInfo.rejected,(state,action)=>{
                state.repoInfoStatus="failed";
                state.repoInfoError=action.payload;
                state.currentRepo=null;
            })
            // Update Repo
            .addCase(updateRepo.pending,(state)=>{
                state.updating=true;
                state.updateError=null;
            })
            .addCase(updateRepo.fulfilled,(state,action)=>{
                state.updating=false;
                state.currentRepo=action.payload;
                // Also update in repos list if it exists
                const index = state.repos.findIndex(r => r._id === action.payload._id);
                if(index !== -1) {
                    state.repos[index] = action.payload;
                }
                state.updateError=null;
            })
            .addCase(updateRepo.rejected,(state,action)=>{
                state.updating=false;
                state.updateError=action.payload;
            })
            // Delete Repo
            .addCase(deleteRepo.pending,(state)=>{
                state.deleting=true;
                state.deleteError=null;
            })
            .addCase(deleteRepo.fulfilled,(state,action)=>{
                state.deleting=false;
                state.repos = state.repos.filter(r => r._id !== action.payload);
                state.currentRepo=null;
                state.deleteError=null;
            })
            .addCase(deleteRepo.rejected,(state,action)=>{
                state.deleting=false;
                state.deleteError=action.payload;
            })
            // Get All Public Repos
            .addCase(getAllPublicRepos.pending,(state,action)=>{

                state.publicReposStatus="loading";
                state.publicReposError=null;


            })
            .addCase(getAllPublicRepos.fulfilled,(state,action)=>{
                state.publicReposStatus="succeeded";
                state.publicRepos=action.payload;
                state.publicReposError=null;
            })
            .addCase(getAllPublicRepos.rejected,(state,action)=>{
                state.publicReposStatus="failed";
                state.publicReposError=action.payload;
            })
            
    }
})



export { getRepos, createRepo, getRepoInfo, updateRepo, deleteRepo ,getAllPublicRepos };
export default repoSlice.reducer;
export const {resetRepos,resetRepoInfo,resetPublicRepos}=repoSlice.actions;
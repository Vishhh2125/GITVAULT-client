import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api.js";



const getCollaborators=createAsyncThunk(
    "collaborator/getCollaborators",
    async({repoId},{rejectWithValue})=>{
        try {
            const response= await api.get(`/repos/${repoId}/collaborators/get`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Something went wrong"
            );
        }
    }
);

const addCollaborator = createAsyncThunk(
    "collaborator/addCollaborator",
    async({repoId, email, role}, {rejectWithValue}) => {
        try {
            const response = await api.post(`/repos/${repoId}/collaborators/add`, { email, role });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Something went wrong"
            );
        }
    }
);

const updateCollaboratorRole = createAsyncThunk(
    "collaborator/updateCollaboratorRole",
    async({repoId, collaboratorId, role}, {rejectWithValue}) => {
        try {
            const response = await api.put(`/repos/${repoId}/collaborators/${collaboratorId}/role`, { role });
            return { collaboratorId, role };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Something went wrong"
            );
        }
    }
);

const deleteCollaborator = createAsyncThunk(
    "collaborator/deleteCollaborator",
    async({repoId, collaboratorId}, {rejectWithValue}) => {
        try {
            await api.delete(`/repos/${repoId}/collaborators/${collaboratorId}`);
            return collaboratorId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Something went wrong"
            );
        }
    }
);




const colloboratorSlice=createSlice({
    name:"collaborator",
    initialState:{
        collaborators:[],
        owner: null,
        isOwner: false,
        isAdmin: false,
        status:"idle",
        error:null,
        // data change state 
        //edit 
        editingId:null,
        deletingId:null,
        actionError:null,
        //creating 
        creating:false,
        createError:null,
    },
    reducers:{
        resetCollaborator:(state)=>{
            state.status="idle",
            state.error=null,
            state.collaborators=[],
            state.editingId=null,
            state.deletingId=null,
            state.actionError=null,
            state.creating=false,
            state.createError=null

        }
    },
    extraReducers:(builder)=>{
        builder
         .addCase(getCollaborators.pending,(state)=>{
            state.status="loading";
            state.error=null;
            state.collaborators=[];
            state.editingId=null;
            state.deletingId=null;
            state.actionError=null;
            state.creating=false;
            state.createError=null;
         })
         .addCase(getCollaborators.fulfilled,(state,action)=>{
            state.status="succeeded";
            state.collaborators=action.payload.collaborators || [];
            state.owner=action.payload.owner || null;
            state.isOwner=action.payload.isOwner || false;
            state.isAdmin=action.payload.isAdmin || false;
            state.error=null;
         })
         .addCase(getCollaborators.rejected,(state,action)=>{
            state.status="failed";
            state.error=action.payload;
            state.collaborators=[];
            state.owner=null;
            state.isOwner=false;
            state.isAdmin=false;
         })
         // Add Collaborator
         .addCase(addCollaborator.pending,(state)=>{
            state.creating=true;
            state.createError=null;
            state.actionError=null;
         })
         .addCase(addCollaborator.fulfilled,(state)=>{
            state.creating=false;
            state.createError=null;
         })
         .addCase(addCollaborator.rejected,(state,action)=>{
            state.creating=false;
            state.createError=action.payload;
         })
         // Update Role
         .addCase(updateCollaboratorRole.pending,(state,action)=>{
            state.editingId=action.meta.arg.collaboratorId;
            state.actionError=null;
         })
         .addCase(updateCollaboratorRole.fulfilled,(state,action)=>{
            const collaborator = state.collaborators.find(c => c._id === action.payload.collaboratorId);
            if(collaborator) {
                collaborator.role = action.payload.role;
            }
            state.editingId=null;
            state.actionError=null;
         })
         .addCase(updateCollaboratorRole.rejected,(state,action)=>{
            state.editingId=null;
            state.actionError=action.payload;
         })
         // Delete Collaborator
         .addCase(deleteCollaborator.pending,(state,action)=>{
            state.deletingId=action.meta.arg.collaboratorId;
            state.actionError=null;
         })
         .addCase(deleteCollaborator.fulfilled,(state,action)=>{
            state.collaborators = state.collaborators.filter(c => c._id !== action.payload);
            state.deletingId=null;
            state.actionError=null;
         })
         .addCase(deleteCollaborator.rejected,(state,action)=>{
            state.deletingId=null;
            state.actionError=action.payload;
         })
    }
})


export default colloboratorSlice.reducer;
export {getCollaborators, addCollaborator, updateCollaboratorRole, deleteCollaborator};
export const { resetCollaborator } = colloboratorSlice.actions;
import {createSlice ,createAsyncThunk} from '@reduxjs/toolkit';
import api from '../api/api.js';



const registerUser=createAsyncThunk(
    "user.registerUser",
    async(userData,{ rejectWithValue })=>{

        try {
            const response = await api.post("/users/register",userData);
            return response.data.data;
            
        } catch (error) {

            console.log("Error registering user:", error);

           return rejectWithValue(
            error.response?.data?.message || error.message  || "Something went wrong"
           )
            
        }
    }
)

const loginUser=createAsyncThunk(
    "user/loginUser",
    async(userData,{rejectWithValue })=>{
        try {

            const response = await api.post("/users/login",userData);
            return response.data.data;
            
        } catch (error) {

            console.log("Error logging in user:", error);

           return rejectWithValue(
            error.response?.data?.message || error.message  || "Something went wrong"
           )
            
        }
    }

)



const logoutUser=createAsyncThunk(
    "user/logoutuser",
    async(_ ,{rejectWithValue})=>{
        try {

            const response = await api.post("/users/logout");
            return response.data.data;      
        } catch (error) {

            console.log("Error logging out user:", error);
              return rejectWithValue(
            error.response?.data?.message || error.message  || "Something went wrong"
              )
        }
    }
)




const userSlice=createSlice({
    name:"user",
    initialState:{
        user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,

        loginStatus: "idle",
        registerStatus: "idle",
        logoutStatus: "idle",

        error: null,
        isAuthenticated: !!localStorage.getItem("token"),
    },
    reducers:{
        clearError: (state) => {
          state.error = null;
        }

    },

    extraReducers: (builder) => {
    builder //register
    .addCase(registerUser.pending, (state) => {
        state.registerStatus = "loading";
        state.error = null;
    })
    .addCase(registerUser.fulfilled, (state) => {
        state.registerStatus = "succeeded";
    })
    .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.error = action.payload;
    })

    // LOGIN
    .addCase(loginUser.pending, (state) => {
        state.loginStatus = "loading";
        state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.accessToken);
        state.isAuthenticated = true;
    })
    .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
    })

    // LOGOUT
    .addCase(logoutUser.pending, (state) => {
        state.logoutStatus = "loading";
        state.error = null;
    })
    .addCase(logoutUser.fulfilled, (state) => {
        state.logoutStatus = "succeeded";
        state.user = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        state.isAuthenticated = false;
    })
    .addCase(logoutUser.rejected, (state, action) => {
        state.logoutStatus = "failed";
        state.error = action.payload;
    });
    }


})


export default userSlice.reducer; //default export for the tsore config 
export {registerUser, loginUser, logoutUser};//extra reducer async thuink export 
export const { clearError } = userSlice.actions; //reducer expport 

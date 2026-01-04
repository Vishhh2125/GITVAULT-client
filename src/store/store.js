import { configureStore } from '@reduxjs/toolkit'
import repoReducer from '../features/repoSlice'
import patReducer from '../features/patSlice.js'
import userReducer from '../features/userSlice.js'

const store = configureStore({
  reducer: {
    repos:repoReducer,
    pat:patReducer,
    user:userReducer
  }
})


export default store;
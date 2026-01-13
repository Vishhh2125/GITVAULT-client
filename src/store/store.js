import { configureStore } from '@reduxjs/toolkit'
import repoReducer from '../features/repoSlice'
import patReducer from '../features/patSlice.js'
import userReducer from '../features/userSlice.js'
import fileTreeReducer from '../features/fileTreeSlice.js'
import collaboratorReducer from '../features/collaboratorSlice.js'
import filecontentReducer from '../features/filecontentSlice.js'
const store = configureStore({
  reducer: {
    repos:repoReducer,
    pat:patReducer,
    user:userReducer,
    fileTree:fileTreeReducer,
    collaborators:collaboratorReducer,
    filecontent:filecontentReducer
  }
})


export default store;
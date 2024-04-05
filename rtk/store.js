import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./user-slice"
import thunk from 'redux-thunk'
import { applyMiddleware } from 'redux'

const store = configureStore({
    reducer: {
        user: userSlice
    }
}, applyMiddleware(thunk))
export default store;
"use client" // This directive is used in Next.js to indicate that the code should run on the client side.

// first file created in redux folder

// Importing necessary functions from Redux Toolkit
import { configureStore } from "@reduxjs/toolkit"

// Importing the apiSlice which is defined in the api folder
import { apiSlice } from "./features/api/apiSlice"

// Importing the authSlice which is defined in the auth folder
import authSlice from "./features/auth/authSlice"

// Creating the Redux store
export const store = configureStore({
    // Setting up reducers for the store, here we're adding apiSlice's and authSlice reducer
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer, // Adding the apiSlice reducer
        auth: authSlice // Adding the authSlice reducer
    },
    // Disabling Redux DevTools in the production environment
    devTools: false,
    // Adding apiSlice's middleware to the default middleware to handle API calls and caching
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware)
})

// This code sets up a Redux store with RTK Query, including the middleware and reducer from your apiSlice.

// Function to initialize the app by refreshing tokens and loading user data on every page load
const initializeApp = async () => {
    // Dispatching the refresh token endpoint to get a new token when the app starts
    await store.dispatch(apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true }))
    
    // Dispatching the load user endpoint to load the current user data when the app starts
    await store.dispatch(apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true }))
}

// Calling the initializeApp function to run when the app loads
initializeApp();

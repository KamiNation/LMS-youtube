// Importing createSlice from Redux Toolkit to create a slice of the store
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// first file in auth folder

// Setting up the initial state for authentication, with empty token and user
const initialState = {
    token: "",
    user: "",
}

// Creating a slice for authentication with reducers to handle various actions
const authSlice = createSlice({
    // Naming the slice 'auth'
    name: "auth",

    // Initial state for the slice
    initialState,

    // Reducers define how the state changes in response to actions
    reducers: {
        // Handles user registration, sets the token from the action payload
        userRegistration: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
        },
        // Handles user login, sets both token and user from the action payload
        userLoggedIn: (state, action: PayloadAction<{accessToken: string, user: string}>) => {
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
        },
        // Handles user logout, clears the token and user information
        userLoggedOut: (state) => {
            state.token = "";
            state.user = "";
        }
    }
})

// Exporting the action creators for use in components
export const { userRegistration, userLoggedIn, userLoggedOut } = authSlice.actions

export default authSlice.reducer

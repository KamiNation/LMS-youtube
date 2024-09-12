import { apiSlice } from "../api/apiSlice"; // Importing the apiSlice from the api folder
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice"; // Importing the userRegistration action from the auth slice


// second file in auth folder

// Defining the expected response type for registration
type RegistrationResponse = {
    message: string;
    activationToken: string;
}

// Defining the expected data type for the registration request (can be expanded with specific fields)
type RegistrationData = {}

// Extending the apiSlice by injecting new endpoints related to authentication
export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // Defining a registration endpoint as a mutation
        register: builder.mutation<RegistrationResponse, RegistrationData>({
            // Setting up the request configuration
            query: (data) => ({
                url: "registration", // API endpoint for registration
                method: "POST", // HTTP method used
                body: data, // Data sent in the request body
                credentials: "include" as const, // Including credentials like cookies
            }),
            // Handling what happens when the query starts
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    // Await the result of the query
                    const result = await queryFulfilled
                    // Dispatch the userRegistration action with the activationToken from the response
                    dispatch(userRegistration({ token: result.data.activationToken }))
                } catch (error: any) {
                    // Log any errors that occur during the request
                    console.log(error);
                }
            }
        }),
        // Defining an activation endpoint as a mutation
        activation: builder.mutation({
            // Setting up the request for activating a user
            query: ({ activation_token, activation_code }) => ({
                url: "activate-user", // API endpoint for user activation
                method: "POST", // HTTP method used
                body: { // Data sent in the request body
                    activation_code,
                    activation_token
                }
            })
        }),
        // after verification screen created this mutation and then went to Login
        // component to use there
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: "login",
                method: "POST",
                body: {
                    email,
                    password
                },
                credentials: "include" as const,
            }),
            // Handling what happens when the query starts
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    // Await the result of the query
                    const result = await queryFulfilled

                    // Dispatch the userRegistration action with the activationToken from the response
                    dispatch(userLoggedIn({
                        accessToken: result.data.accessToken,
                        user: result.data.user
                    }))
                } catch (error: any) {
                    // Log any errors that occur during the request
                    console.log(error);
                }
            }
        }),
        socialAuth: builder.mutation({
            query: ({ email, name, avatar }) => ({
                url: "social-auth",
                method: "POST",
                body: {
                    email,
                    name, 
                    avatar
                },
                credentials: "include" as const,
            }),
            // Handling what happens when the query starts
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    // Await the result of the query
                    const result = await queryFulfilled

                    // Dispatch the userRegistration action with the activationToken from the response
                    dispatch(userLoggedIn({
                        accessToken: result.data.accessToken,
                        user: result.data.user
                    }))
                } catch (error: any) {
                    // Log any errors that occur during the request
                    console.log(error);
                }
            }
        }),
        logOut: builder.query({
            query: () => ({
                url: "logout",
                method: "GET", 
                credentials: "include" as const,
            }),
            // Handling what happens when the query starts
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    // Dispatch the userRegistration action with the activationToken from the response
                    dispatch(userLoggedOut())
                } catch (error: any) {
                    // Log any errors that occur during the request
                    console.log(error);
                }
            }
        })
    })
})

// Exporting the hooks for the defined mutations, used in components to trigger these actions
export const { useRegisterMutation, useActivationMutation, useLoginMutation, useSocialAuthMutation, useLogOutQuery } = authApi


// This code extends the apiSlice with authentication-related endpoints, specifically for user registration and activation. 

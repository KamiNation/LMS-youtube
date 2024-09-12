// first file in api folder

// Importing createApi and fetchBaseQuery from RTK Query to set up the API slice
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

// Defining the API slice with createApi, which sets up endpoints and base query settings
export const apiSlice = createApi({
    // The reducerPath is used to identify the slice in the Redux store
    reducerPath: "api",

    // Setting up the base query with the server URI from environment variables
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_SERVER_URI
    }),

    // Endpoints will be defined here; currently, it's an empty object
    endpoints: (builder) => ({
        // implemented refreshToken get method and used in store initializeApp function
        refreshToken: builder.query({
            query: (data) => ({
                url: "refresh",
                method: "GET",
                credentials: "include" as const,
            }),
        }),

        // implemented admin get method and used in store initializeApp function
        loadUser: builder.query({
            query: (data) => ({
                url: "me",
                method: "GET",
                credentials: "include" as const,
            }),
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
    }),
})

// Exporting the API slice; currently, no specific hooks or endpoints are exported
export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice

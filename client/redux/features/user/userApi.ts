import { apiSlice } from "../api/apiSlice";

// first file in user folder in features
// this file is created to ensure user can perform
// some dynamic operation like image upload

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateAvatar: builder.mutation({
            query:(avatar) => ({
                url:"update-user-avatar",
                method: "PUT",
                body: {avatar},
                credentials: "include" as const
            })
        }),
        // used this in profile-info to enable user
        // update their name and email
        editProfile: builder.mutation({
            query:({name}) => ({
                url:"update-user-info",
                method: "PUT",
                body: {
                    name,
                },
                credentials: "include" as const
            })
        }),
        updatePassword: builder.mutation({
            query:({oldPassword, newPassword}) => ({
                url:"update-user-password",
                method: "PUT",
                body: {
                    oldPassword,
                    newPassword
                },
                credentials: "include" as const
            })
        })
    }),

})


export const {useUpdateAvatarMutation, useEditProfileMutation, useUpdatePasswordMutation} = userApi
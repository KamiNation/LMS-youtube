import express from "express"

import { activateUser, registrationUser, loginUser, logoutUser, updateAccessToken, getUserInfo, socialAuth, updateUserInfo, updatePassword, updateProfilePicture, getAllUsers, updateUserRole, deleteUser } from "../controllers/user.controller"

import { isAuthenticated, authorizeRoles } from "../middleware/auth";



const userRouter = express.Router();

userRouter.post("/registration", registrationUser)

userRouter.post("/activate-user", activateUser)

userRouter.post("/login", loginUser)

// userRouter.post("/logout", isAuthenticated, authorizeRoles("admin"), logoutUser)

userRouter.post("/logout", isAuthenticated, logoutUser)

userRouter.get("/refresh", updateAccessToken)

userRouter.get("/user", isAuthenticated, getUserInfo)

userRouter.post("/social-auth", socialAuth)

userRouter.put("/update-user-info", isAuthenticated, updateUserInfo)

userRouter.put("/update-user-password", isAuthenticated, updatePassword)

userRouter.put("/update-user-picture", isAuthenticated, updateProfilePicture)

userRouter.get("/get-users",
    isAuthenticated,
    authorizeRoles("admin"),
    getAllUsers)

userRouter.put("/update-user-role",
    isAuthenticated,
    authorizeRoles("admin"),
    updateUserRole
)

userRouter.delete("/delete-user/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    deleteUser
)





export default userRouter 
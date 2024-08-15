import express from "express"
import { activateUser, registrationUser, loginUser, logoutUser, authorizeRoles, updateAccessToken, getUserInfo } from "../controllers/user.controller"
import { isAuthenticated } from "../middleware/auth";



const userRouter = express.Router();

userRouter.post("/registration", registrationUser)
userRouter.post("/activate-user", activateUser)
userRouter.post("/login", loginUser)
// userRouter.post("/logout", isAuthenticated, authorizeRoles("admin"), logoutUser)
userRouter.post("/logout", isAuthenticated, logoutUser)
userRouter.get("/refresh", updateAccessToken)
userRouter.get("/user", isAuthenticated, getUserInfo )

export default userRouter 
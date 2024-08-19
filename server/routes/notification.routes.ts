import express from "express"
import { authorizeRoles, isAuthenticated } from "../middleware/auth"
import { getAllNotification, updateNotification } from "../controllers/notification.controller"

const notificationRouter = express.Router()

// Haven't tested yet

notificationRouter.get("/get-all-notifications",
    isAuthenticated,
    authorizeRoles("admin"),
    getAllNotification
)

notificationRouter.put("/update-notifications/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    updateNotification
)

export default notificationRouter
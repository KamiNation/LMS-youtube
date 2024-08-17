import express from "express"

import { isAuthenticated, authorizeRoles, } from "../middleware/auth";
import { uploadCourse, editCourses, getSingleCourse } from "../controllers/course.controller";


const courseRouter = express.Router();

courseRouter.post("/create-course", 
    isAuthenticated, 
    authorizeRoles("admin"), 
    uploadCourse)

courseRouter.put("/edit-course/:id", 
    isAuthenticated, 
    authorizeRoles("admin"), 
    editCourses
)

courseRouter.get("/get-course/:id", 
    isAuthenticated, 
    authorizeRoles("admin"), 
    getSingleCourse
)


export default courseRouter
import express from "express"

import { isAuthenticated, authorizeRoles, } from "../middleware/auth";
import { createCourses, editCourses } from "../controllers/course.controller";


const courseRouter = express.Router();

courseRouter.post("/create-course", 
    isAuthenticated, 
    authorizeRoles("admin"), 
    createCourses)

courseRouter.put("/edit-course/:id", 
    isAuthenticated, 
    authorizeRoles("admin"), 
    editCourses
)


export default courseRouter
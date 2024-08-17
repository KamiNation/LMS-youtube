import express from "express"

import { isAuthenticated, authorizeRoles, } from "../middleware/auth";
import { createCourses } from "../controllers/course.controller";


const courseRouter = express.Router();

courseRouter.post("/create-course", 
    isAuthenticated, 
    authorizeRoles("admin"), 
    createCourses)


export default courseRouter
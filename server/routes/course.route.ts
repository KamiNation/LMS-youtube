import express from "express"

import { isAuthenticated, authorizeRoles, } from "../middleware/auth";
import { uploadCourse, editCourses, getSingleCourse, getAllCourses, getCourseByUser, addQuestion, addAnswer, addReview, addReplyToReview, deleteCourse } from "../controllers/course.controller";


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
    getSingleCourse
)

courseRouter.get("/get-courses", 
    getAllCourses
)

// start controller test from here 5:32:40

courseRouter.get("/get-course-content/:id", 
    isAuthenticated, 
    getCourseByUser
)

courseRouter.put("/add-question", 
    isAuthenticated, 
    addQuestion
)

courseRouter.put("/add-answer", 
    isAuthenticated, 
    addAnswer
)

courseRouter.put("/add-review/:id", 
    isAuthenticated, 
    addReview
)

courseRouter.put("/add-reply", 
    isAuthenticated, 
    authorizeRoles("admin"),
    addReplyToReview
)

courseRouter.put("/get-courses", 
    isAuthenticated, 
    authorizeRoles("admin"),
    getAllCourses
)


courseRouter.delete("/delete-course/:id", 
    isAuthenticated, 
    authorizeRoles("admin"),
    deleteCourse
)



export default courseRouter
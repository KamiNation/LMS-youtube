import cloudinary from 'cloudinary';
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from '../middleware/catchAsyncError';
import { createCourse } from '../services/course.service';
import CourseModel from '../models/course.model';


// upload course controller
export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;

        const thumbnail = data.thumbnail;

        if (thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            });


            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }

        createCourse(data, res, next);


    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})


// edit the course
export const editCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        
        const thumbnail = data.thumbnail;
    
        if (thumbnail) {
            await await cloudinary.v2.uploader.destroy(thumbnail.public_id)

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }

        //    get course id
        const courseId = req.params.id;

        const course = await CourseModel.findByIdAndUpdate(courseId, { $set: data }, { new: true })
     
        res.status(201).json({
            success: true,
            course
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})


// get single course  --- with purchasing
export const getSingleCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
    
        // search for course
        const course = await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")

        res.status(200).json({
            success: true,
        course
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

























// export const controllerNamehere = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
     

//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500))
//     }
// })
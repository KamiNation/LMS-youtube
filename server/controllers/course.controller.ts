import cloudinary from 'cloudinary';
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from '../middleware/catchAsyncError';
import { createCourse } from '../services/course.service';
import CourseModel from '../models/course.model';


// upload course controller
export const createCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        console.log("data in create course =>", data);

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
        console.log("data in edit course =>", data);

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
        console.log("course in edit course =>", course);
        

        res.status(201).json({
            success: true,
            course
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

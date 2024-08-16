import cloudinary from 'cloudinary';
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from '../middleware/catchAsyncError';
import { createCourse } from '../services/course.service';


// upload course controller
export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        console.log("upload controller up and grateful");

        const data = req.body;
        console.log(data);
        

        if (!data) {
            return next(new ErrorHandler("Please enter data", 400))
        }

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

        await createCourse(data, res, next)

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})
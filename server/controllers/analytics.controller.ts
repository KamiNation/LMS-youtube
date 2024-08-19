import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import userModel from "../models/user.models";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";

// get users analytics -- only admin

export const getUSerAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const users = await generateLast12MonthsData(userModel)

        res.status(200).json({
            success: true,
            users
        })


    } catch (error: any) {
        // Catch any errors that occur during the profile picture update process and pass them to the error handling middleware
        return next(new ErrorHandler(error.message, 400));
    }
});


// get courses analytics -- only admin
export const getCourseAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const courses = await generateLast12MonthsData(CourseModel)

        res.status(200).json({
            success: true,
            courses
        })


    } catch (error: any) {
        // Catch any errors that occur during the profile picture update process and pass them to the error handling middleware
        return next(new ErrorHandler(error.message, 400));
    }
});



// get order analytics -- only admin
export const getOrderAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const orders = await generateLast12MonthsData(OrderModel)

        res.status(200).json({
            success: true,
            orders
        })


    } catch (error: any) {
        // Catch any errors that occur during the profile picture update process and pass them to the error handling middleware
        return next(new ErrorHandler(error.message, 400));
    }
});

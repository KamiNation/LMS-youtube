import ejs from 'ejs';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from '../middleware/catchAsyncError';
import { createCourse } from '../services/course.service';
import CourseModel from '../models/course.model';
import { redis } from '../utils/redis';
import path from 'path';
import sendMail from '../utils/sendMail';

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

        const courseId = req.params.id

        const isCacheExist = await redis.get(courseId)
        console.log("hitting redis");


        if (isCacheExist) {
            const course = JSON.parse(isCacheExist)
            res.status(200).json({
                success: true,
                course,
            })
        } else {
            // search for course
            const course = await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")

            console.log("hitting mongodb");


            await redis.set(courseId, JSON.stringify(course))

            res.status(200).json({
                success: true,
                course,
            })
        }


    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})


// get all courses without purchase
export const getAllCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const isCacheExist = await redis.get("allCourses")
        console.log("hitting redis");


        if (isCacheExist) {
            const courses = JSON.parse(isCacheExist)
            console.log("hitting mongodb");


            res.status(200).json({
                success: true,
                courses,
            })
        } else {

            const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")

            await redis.set("allCourse", JSON.stringify(courses))


            res.status(200).json({
                success: true,
                courses
            })
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})



export const getCourseByUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userCourseList = req.user?.courses;

        const courseId = req.params.id;

        const courseExist = userCourseList?.find((course: any) => course._id.toString() === courseId)

        if (!courseExist) {
            return (new ErrorHandler("You are not eligible to access this course", 400))
        }

        const course = await CourseModel.findById(courseId);

        const content = course?.courseData;

        res.status(200).json({
            success: true,
            content,
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})


// add question in course
interface addQuestionDataInterface {
    question: string;
    courseId: string;
    contentId: string
}
export const addQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { question, courseId, contentId }: addQuestionDataInterface = req.body

        const course = await CourseModel.findById(contentId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content Id", 400))
        }

        const courseContent = course?.courseData.find((item: any) => item._id.equals(contentId))

        if (!courseContent) {
            return next(new ErrorHandler("Invalid content id", 400))
        }

        // creata a new question
        const newQuestion: any = {
            user: req.user,
            question,
            questionReplies: []
        };

        // add this question to our course content
        courseContent.questions.push(newQuestion);

        // save the updated course
        await course?.save();

        res.status(200).json({
            success: true,
            course
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})


// add answering course question
interface addAnswerDataInterface {
    answer: string;
    courseId: string;
    contentId: string;
    questionId: string;
}


export const addAnswer = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {


        const { answer, courseId, contentId, questionId }: addAnswerDataInterface = req.body

        const course = await CourseModel.findById(courseId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content Id", 400))
        }

        const courseContent = course?.courseData.find((item: any) => item._id.equals(contentId))

        if (!courseContent) {
            return next(new ErrorHandler("Invalid content id", 400))
        }

        const question = courseContent?.questions?.find((item: any) => item._id.equals(questionId))

        if (!question) {
            return next(new ErrorHandler("Invalid question id", 400))
        }

        // creation a new answer object
        const newAnswer: any = {
            user: req.user,
            answer,
        }

        // add this answer to our user content
        question.questionReplies?.push(newAnswer)

        await course?.save()

        if (req.user?._id === question.user._id) {
            // create a notification

        } else {
            const data = {
                name: question.user.name,
                title: courseContent.title,
            }

            const html = await ejs.renderFile(path.join(__dirname, "../mails/question-reply.ejs"), data)

            try {
                await sendMail({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "question-reply.ejs",
                    data,
                })
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 500))

            }
        }

        res.status(200).json({
            success: true,
            course,
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})



// add review to course and reply
interface addReviewDataInterface {
    courseId: string;
    review: string;
    rating: number;
    userId: string
}


export const addReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userCourseList = req.user?.courses;

        const courseId = req.params.id;

        // check if courseId already exists in userCourseList based on _id
        const courseExist = userCourseList?.some((course: any) => course._id.toString() === courseId.toString())

        if (!courseExist) {
            return next(new ErrorHandler("You are not eligible to access this course", 500))
        }

        const course = await CourseModel.findById(courseId);

        const { review, rating }: addReviewDataInterface = req.body;

        const reviewData: any = {
            user: req.user,
            comment: review,
            rating,
        }

        course?.reviews.push(reviewData)

        let avg = 0;
        course?.reviews.forEach((rev: any) => {
            avg += rev.rating
        })

        if (course) {
            course.ratings = avg / course.reviews.length
        }

        await course?.save();

        const notification = {
            title: "New Review Received",
            message: `${req.user?.name} has given a review in ${course?.name}`
        }

        // create notification

        res.status(200).json({
            success: true,
            course
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})


// add reply in reviews
interface addReviewDataInterface {
    comment: string;
    courseId: string;
    reviewId: string;
}


export const addReplyToReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { comment, reviewId, courseId }: addReviewDataInterface = req.body

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 500))
        }

        const review = course?.reviews?.find((rev: any) => rev._id.toString() === reviewId);

        if (!review) {
            return next(new ErrorHandler("Review not found", 500))
        }

        const replyData: any = {
            user: req.user,
            comment,
        }

        if(!review.commentReplies){
            review.commentReplies = []
        }

        review.commentReplies?.push(replyData)

        await course?.save()


        res.status(200).json({
            success: true,
            course
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})




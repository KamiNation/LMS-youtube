// Packages import
import express, { NextFunction, Request, Response } from "express"
require("dotenv").config();
import cors from "cors"
import cookieParser from "cookie-parser";
import morgan from "morgan"


// Custom import
import userRouter from "./routes/user.routes";
import courseRouter from "./routes/course.routes";

// import errorMiddleware from middleware
import { ErrorMiddleware } from "./middleware/error";


// express server 
export const app = express();


// Body parser Middleware to parse JSON request bodies with a specified size limit
app.use(express.json({ limit: "50mb" }))

// Cookie-parser Middleware for parsing cookies in requests.
app.use(cookieParser())

// cors Middleware to enable and manage Cross-Origin Resource Sharing
app.use(cors({
    origin: process.env.ORIGIN
}))

app.use(morgan("tiny"))

// routes
app.use("/api/v1", userRouter, courseRouter)
// app.use("/c", courseRouter)

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API Is Working!"
    })
})

// unknown routes 
app.all("*", (req: Request, res: Response, next: NextFunction) =>{
    const err = new Error(`Route ${req.originalUrl} not found`) as any
    err.statusCode = 404;
    next(err)
})


// error handling middleware
app.use(ErrorMiddleware);
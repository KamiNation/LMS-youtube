import { NextFunction, Request, Response } from "express"

import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction ) => {
    // Inside here we define the common errors

    // Error message
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // wrong mongodb ID
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`
        err = new ErrorHandler(message, 400);
    }

    // Duplicate key error for authentication
    if(err.name === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400);
    }

    // Wrong JWT Error
    if(err.name === "JsonwebTokenError"){
        const message = "Json web token is invalid, try again"
        err = new ErrorHandler(message, 400);
    }

    // JWT Expired Error
    if(err.name === "TokenExpiredError"){
        const message = "Json web token is expired, try again"
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}
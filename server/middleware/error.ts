// Import types from Express: Request, Response, and NextFunction 
// These represent the request, response, and next middleware function respectively
import { NextFunction, Request, Response } from "express";

// Import the custom ErrorHandler utility for standardized error handling
import ErrorHandler from "../utils/ErrorHandler";

// Define the ErrorMiddleware function that will handle errors in the application
// It takes in four arguments: the error object `err`, request `req`, response `res`, and the `next` function
export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Set default status code to 500 if not provided in the error object
    // Set default message to "Internal server error" if not provided
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // Handle MongoDB CastError, which occurs when an invalid MongoDB ObjectId is used
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        // Create a new ErrorHandler instance with the custom message and a 400 status code (Bad Request)
        err = new ErrorHandler(message, 400);
    }

    // Handle MongoDB Duplicate Key Error, often occurs when trying to create a user with an email that already exists
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        // Create a new ErrorHandler instance with the custom message and a 400 status code
        err = new ErrorHandler(message, 400);
    }

    // Handle JSON Web Token error, which occurs when an invalid token is provided
    if (err.name === "JsonWebTokenError") {
        const message = "Json web token is invalid, try again";
        // Create a new ErrorHandler instance with the custom message and a 400 status code
        err = new ErrorHandler(message, 400);
    }

    // Handle JWT Expired Error, which occurs when a token has expired
    if (err.name === "TokenExpiredError") {
        const message = "Json web token is expired, try again";
        // Create a new ErrorHandler instance with the custom message and a 400 status code
        err = new ErrorHandler(message, 400);
    }

    // Send the response with the status code and message set in the error object
    res.status(err.statusCode).json({
        success: false,  // Indicate that the operation was unsuccessful
        message: err.message  // Provide the error message to the client
    });
};

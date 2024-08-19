import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";




// Middleware to check if the user is authenticated
export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {


    console.log("isAuthenticated middleware");
    // Retrieve the access token from cookies
    const access_token = req.cookies.access_token as string;

    // If the access token is not present, throw an error indicating that login is required
    if (!access_token) {
        return next(new ErrorHandler("Please login to access the request", 400));  // If email exists, throw an error
    }

    // Verify the access token and decode the payload
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;


    // If decoding fails or the token is invalid, throw an error
    if (!decoded) {
        return next(new ErrorHandler("Access token is not valid", 400))
    }

    // Retrieve the user data from Redis using the decoded user ID
    const user = await redis.get(decoded.id);

    // If the user is not found in Redis, throw an error
    if (!user) {
        return next(new ErrorHandler("Please login to access this resource not found", 400))
    }

    // Attach the user data to the request object after parsing it from JSON
    req.user = JSON.parse(user);

    // Proceed to the next middleware or route handler
    next();

})


// validate user role
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // console.log("authorizeRoles middleware", req.user);

        if (!roles.includes(req.user?.role || "")) {
            return next(new ErrorHandler(`Roles: ${req.user?.role} is not allowed to access this resource`, 400))
        }

         // Proceed to the next middleware or route handler
        next()
    }
}

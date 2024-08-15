// Load environment variables from a .env file into process.env
require("dotenv").config();

import { Response } from "express";
import { redis } from "./redis";
import { UserModelInterface } from "../models/user.models";
import { RedisKey } from "ioredis";

// Interface for defining the options of JWT tokens in cookies
interface jwtTokenOptionsInterface {
    expires: Date;  // Expiration date of the cookie
    maxAge: number; // Maximum age of the cookie in milliseconds
    httpOnly: boolean; // Prevents client-side JavaScript from accessing the cookie
    sameSite: 'lax' | 'strict' | 'none' | undefined; // Controls whether the cookie is sent with cross-site requests
    secure?: boolean; // Ensures the cookie is sent only over HTTPS
}

// Function to send tokens (access and refresh) to the user and set them in cookies
export const sendToken = (user: UserModelInterface, statusCode: number, res: Response) => {
    // Generate the access and refresh tokens using the user's custom schema methodsArgument of type 'unknown' is not assignable to parameter of type 'RedisKey'.ts(2345)
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // Store the user's session in Redis, with the user's ID as the key
    redis.set(user._id as RedisKey, JSON.stringify(user) as any);

    // Parse environment variables to get expiration times for tokens, with fallback values
    const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10); // Default: 5 minutes
    const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10); // Default: 20 minutes

    // Define cookie options for the access token
    const accessTokenOptions: jwtTokenOptionsInterface = {
        expires: new Date(Date.now() + accessTokenExpire * 1000), // Expiration date of the access token
        maxAge: accessTokenExpire * 1000, // Maximum age of the access token cookie in milliseconds
        httpOnly: true, // Make the cookie inaccessible to client-side scripts
        sameSite: 'lax' // Allow the cookie to be sent with same-site requests and top-level navigation
    };

    // Define cookie options for the refresh token
    const refreshTokenOptions: jwtTokenOptionsInterface = {
        expires: new Date(Date.now() + refreshTokenExpire * 1000), // Expiration date of the refresh token
        maxAge: refreshTokenExpire * 1000, // Maximum age of the refresh token cookie in milliseconds
        httpOnly: true, // Make the cookie inaccessible to client-side scripts
        sameSite: 'lax' // Allow the cookie to be sent with same-site requests and top-level navigation
    };

    // If the application is running in production, ensure cookies are only sent over HTTPS
    if (process.env.NODE_ENV === 'production') {
        accessTokenOptions.secure = true;
        refreshTokenOptions.secure = true; // Ensure refresh token cookie is also secure in production
    }

    // Set the access token cookie in the response
    res.cookie("access_token", accessToken, accessTokenOptions);

    // Set the refresh token cookie in the response
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    // Send a JSON response with the user object and the access token
    res.status(statusCode).json({
        success: true,
        user,
        accessToken
    });
};

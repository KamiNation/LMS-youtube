// Load environment variables from .env file
require("dotenv").config();

// Import necessary modules and types from Express, Mongoose model, and other utilities
import { Request, Response, NextFunction } from "express";
import userModel, { UserModelInterface } from "../models/user.models";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";

// Define an interface for the user registration controller's input data
interface userRegControllerInterface {
    name: string;
    email: string;
    password: string;
    avatar?: string;  // Avatar is optional
}

// Controller function to handle user registration, wrapped with CatchAsyncError to handle errors
export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Destructure user input from request body
        const { name, email, password } = req.body;

        // Check if the email already exists in the database
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler("Email already exists", 400));  // If email exists, throw an error
        }

        // Create a new user object using the input data
        const user: userRegControllerInterface = {
            name,
            email,
            password
        };

        // Generate an activation token for the user
        const activationToken = activationTokenHandler(user);

        // Extract the activation code from the token
        const activationCode = activationToken.activationCode;

        // Prepare data to be sent in the activation email
        const data = { user: { name: user.name }, activationCode };

        // Optionally, render the EJS template for the activation email (uncomment to use)
        // const htmls = await ejs.renderFile(path.join(__dirname, "../mails/activation-email.ejs"), data);
        // console.log("html from regcontroller =>", htmls);

        // Send activation email to the user's email address
        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                template: "activation-email.ejs",  // EJS template for the email
                data
            });

            // Respond with success and the activation token (needed by the frontend)
            res.status(201).json({
                success: true,
                message: `Please check your mail ${user.email} to activate your account`,
                activationToken: activationToken.token
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));  // Handle any errors during email sending
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));  // Handle any other errors during registration
    }
});

// Define an interface for the user activation token structure
interface userActivationToken {
    token: string;
    activationCode: string;
}

// Function to generate an activation token and activation code
export const activationTokenHandler = (user: userRegControllerInterface): userActivationToken => {
    // Generate a random 4-digit activation code
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Sign a JWT token containing the user data and activation code, with a 5-minute expiration
    const token = jwt.sign(
        {
            user,
            activationCode
        },
        process.env.ACTIVATION_SECRET as Secret,  // Secret key from environment variables
        { expiresIn: "5m" }  // Token expires in 5 minutes
    );

    // Return both the token and activation code
    return {
        token,
        activationCode
    };
};

// Define an interface for the input data when activating a user
interface activateUserControllerInterface {
    activation_token: string;
    activation_code: string;
}

// Controller function to handle user activation
export const activateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Destructure activation token and code from the request body 
        // but inside the activation_token is also the user and activation code
        const { activation_token, activation_code } = req.body as activateUserControllerInterface;

        // Verify the token using JWT and the secret key
        const newUser: { user: UserModelInterface, activationCode: string } = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET as string
        ) as { user: UserModelInterface; activationCode: string };

        // Check if the provided activation code matches the one in the token
        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid activation code", 400));  // Throw error if codes don't match
        }

        // Destructure the user data and activation code from the decoded token stored in newUser
        const { name, email, password } = newUser.user;

        // Check if the user already exists in the database
        const existUser = await userModel.findOne({ email });
        if (existUser) {
            return next(new ErrorHandler("Email already exists", 400));  // Throw error if email is already registered
        }

        // Create a new user in the database with the verified data
        const user = await userModel.create({
            name,
            email,
            password
        });

        // Respond with success if user is successfully activated
        res.status(201).json({
            success: true
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));  // Handle any errors during user activation
    }
});


// Login user controller
interface loginUserControllerInterface {
    email: string
    password: string
}
// This function handles user login and is wrapped with CatchAsyncError to manage any errors asynchronously.
export const loginUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Destructure email and password from the request body and cast it to the expected interface.
        const { email, password } = req.body as loginUserControllerInterface;

        // Check if both email and password are provided. If not, throw an error.
        if (!email || !password) {
            return next(new ErrorHandler("Please enter email and password", 400)); // Handle the error by passing it to the next middleware.
        }

        // Find the user in the database by their email and explicitly select the password field.
        // The password field is not selected by default for security reasons.
        const user = await userModel.findOne({ email }).select("+password");

        // If the user is not found, throw an error indicating that the email or password is incorrect.
        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 400)); // Handle the error by passing it to the next middleware.
        }

        // Compare the provided password with the hashed password stored in the database.
        const isPasswordMatch = await user.comparePassword(password);

        // If the passwords do not match, throw an error indicating invalid email or password.
        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid email or password", 400)); // Handle the error by passing it to the next middleware.
        }

        // If the code execution reaches here, it means the user credentials are valid. snedToken() is inside jwt.ts
        sendToken(user, 200, res)

    } catch (error: any) {
        // Catch any other errors that occur during the login process and pass them to the next middleware.
        return next(new ErrorHandler(error.message, 400)); // Handle the error by passing it to the next middleware.
    }
});


// login user
export const logoutUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

try {
    
    // when user logouts we need to empty the token
    res.cookie("access_token", "", {maxAge: 1});
    res.cookie("refresh_token", "", {maxAge: 1});

    res.status(200).json({
        succes: true,
        message: "Logged out succesfully"
    })



} catch (error: any) {
    // Catch any other errors that occur during the login process and pass them to the next middleware.
    return next(new ErrorHandler(error.message, 400)); // Handle the error by passing it to the next middleware.
}


})

import { RedisKey } from 'ioredis';

// Load environment variables from .env file
require("dotenv").config();

// Import necessary modules and types from Express, Mongoose model, and other utilities
import { Request, Response, NextFunction } from "express";
import userModel, { UserModelInterface } from "../models/user.models";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import sendMail from "../utils/sendMail";
import { accessTokenOptions, sendToken, refreshTokenOptions } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getUserById } from "../services/user.service";
import cloudinary from "cloudinary"

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


// logout user
// Handle user logout, clear cookies, and return a success message
export const logoutUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    try {
        // Clear the access token by setting it as an empty string with a short expiration time
        res.cookie("access_token", "", { maxAge: 1 });

        // Clear the refresh token by setting it as an empty string with a short expiration time
        res.cookie("refresh_token", "", { maxAge: 1 });

        // The above does not delete our session in redis so 
        // we need to do that but first inclue our protected routes
        const userId = (req.user?._id as string) || "";

        console.log(userId);

        redis.del(userId);



        // Send a successful response to indicate the user has logged out
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });



    } catch (error: any) {
        // Catch any errors that occur during the logout process and pass them to the next middleware
        return next(new ErrorHandler(error.message, 400)); // Handle the error by passing it to the next middleware
    }

});




// update access token
export const updateAccessToken = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve the refresh token from the cookies in the incoming request
        const refresh_token = req.cookies.refresh_token as string;

        // Validate the refresh token using JWT's verify method
        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as string) as JwtPayload;

        // Error message for cases where the token cannot be refreshed
        const message = "Could not refresh token";

        // If the token is invalid or cannot be decoded, send an error response
        if (!decoded) {
            return next(new ErrorHandler(message, 400));
        }

        // Fetch the session from Redis using the user ID from the decoded token
        const session = await redis.get(decoded.id as string);

        // If the session does not exist in Redis, send an error response
        if (!session) {
            return next(new ErrorHandler(message, 400));
        }

        // Parse the user information from the session data stored in Redis
        const user = JSON.parse(session);

        // Generate a new access token for the user with a short expiration time (e.g., 5 minutes)
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string, {
            expiresIn: "5m"
        });

        // Generate a new refresh token for the user with a longer expiration time (e.g., 3 days)
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, {
            expiresIn: "3d"
        });

        req.user = user;

        // Set the new access and refresh tokens in the user's cookies with the appropriate options
        res.cookie("accessToken", accessToken, accessTokenOptions);
        res.cookie("refreshToken", refreshToken, refreshTokenOptions);

        // Send a success response back to the client, including the new access token
        res.status(200).json({
            status: "success",
            accessToken
        });

    } catch (error: any) {
        // Catch any errors that occur during the token update process and pass them to the error handling middleware
        return next(new ErrorHandler(error.message, 400));
    }
});



// get user info
export const getUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract the user ID from the authenticated user in the request object
        const userId = req.user?._id;

        // Call the function to get user details by their ID and send the response back to the client
        // The `getUserById` function handles the response sending
        getUserById(userId as string, res);

    } catch (error: any) {
        // Catch any errors that occur during the process and pass them to the error handling middleware
        return next(new ErrorHandler(error.message, 400));
    }
});



interface socialAuthBodyInterface {
    email: string
    name: string
    avatar: string
}


// social auth
export const socialAuth = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract user data (email, name, avatar) from the request body sent by the frontend
        const { email, name, avatar } = req.body as socialAuthBodyInterface;

        // Check if a user with the provided email already exists in the database
        const user = await userModel.findOne({ email });

        // If the user does not exist, create a new user in the database with the provided information
        if (!user) {
            const newUser = await userModel.create({ email, name, avatar });
            // Send an authentication token to the newly created user and respond with a success status
            sendToken(newUser, 200, res);
        } else {
            // If the user already exists, send an authentication token to the user and respond with a success status
            sendToken(user, 200, res);
        }

    } catch (error: any) {
        // Catch any errors that occur during the social authentication process and pass them to the error handling middleware
        return next(new ErrorHandler(error.message, 400));
    }
});



// update user-info, password and avatar
interface updateUserInfoInterface {
    name?: string;
    email?: string
}


export const updateUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract 'email' and 'name' from the request body, ensuring they match the expected interface
        const { email, name } = req.body as updateUserInfoInterface;

        // Retrieve the user ID from the authenticated user's session
        const userId = req.user?._id as string;

        // Find the user in the database using the extracted user ID
        const user = await userModel.findById(userId);

        // If an email is provided and the user exists
        if (email && user) {
            // Check if the new email already exists in the database to prevent duplicate emails
            const isEmailExist = await userModel.findOne({ email });
            if (isEmailExist) {
                // If the email already exists, return an error response to avoid conflicting accounts
                return next(new ErrorHandler("Email already exists", 400));
            }
            // Update the user's email if the new email is unique
            user.email = email;
        }

        // If the user exists, proceed with the name update if both name and user are provided
        if (name && user) {
            user.name = name;
        }

        // Save the updated user information to the database
        await user?.save();

        // Update the user's session in Redis with the new user information
        await redis.set(userId, JSON.stringify(user));

        // Send a success response with the updated user information
        res.status(201).json({
            success: true,
            user,
        });

    } catch (error: any) {
        // Catch any errors that occur during the update process and pass them to the error handling middleware
        return next(new ErrorHandler(error.message, 400));
    }
});


// update password
interface updatePasswordInterface {
    oldPassword: string
    newPassword: string
}


export const updatePassword = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { oldPassword, newPassword } = req.body as updatePasswordInterface


        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler("Please enter old or new password ", 400))
        }

        const user = await userModel.findById(req.user?._id).select("+password")

        if (user?.password === undefined) {
            return next(new ErrorHandler("Invalid User", 400))
        }

        const isPasswordMatch = await user?.comparePassword(oldPassword);

        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid Old Password", 400))
        }

        user.password = newPassword

        await user.save()

        await redis.set(req.user?._id as string, JSON.stringify(user));

        res.status(201).json({
            success: true,
            user
        })

    } catch (error: any) {
        // Catch any errors that occur during the update process and pass them to the error handling middleware
        return next(new ErrorHandler(error.message, 400));
    }
});


// update profile picture
interface updateProfilePictureInterface {
    avatar: string
}

export const updateProfilePicture = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract the new avatar URL from the request body
        const { avatar } = req.body as updateProfilePictureInterface;

        // Retrieve the user ID from the authenticated session
        const userId = req.user?._id;

        // Find the user in the database using the user ID
        const user = await userModel.findById(userId);

        // If the new avatar is provided and the user exists
        if (avatar && user) {
            // If the user already has an avatar, delete the existing image from Cloudinary
            if (user.avatar?.public_id) {
                await cloudinary.v2.uploader.destroy(user.avatar.public_id);
            }

            // Upload the new avatar to Cloudinary
            const myCloud = await cloudinary.v2.uploader.upload(avatar, { folder: "avatars", width: 150 });

            // Update the user's avatar information with the new image's public_id and secure URL
            user.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };

            // Save the updated user information to the database
            await user?.save();

            await redis.set(userId as string, JSON.stringify(user))

            // Send a success response with the updated user information
            res.status(200).json({
                success: true,
                user,
            });
        } else {
            // If the avatar or user is not provided, send an appropriate error response
            return next(new ErrorHandler("Invalid request: missing avatar or user", 400));
        }

    } catch (error: any) {
        // Catch any errors that occur during the profile picture update process and pass them to the error handling middleware
        return next(new ErrorHandler(error.message, 400));
    }
});

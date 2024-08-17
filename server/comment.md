# Comment on some part of the code

<br>

## Explanation CatchAsyncError

```typescript
// Import types from Express: Request, Response, and NextFunction, 
// which represent the request, response, and next middleware function respectively
import { NextFunction, Request, Response } from "express";

// Define a higher-order function `CatchAsyncError` that takes an async function `Func` as an argument
// It returns a new function that automatically catches any errors thrown in the async function 
// and passes them to the next middleware (error handler)
export const CatchAsyncError = (Func: any) => (req: Request, res: Response, next: NextFunction) => {
    // The returned function runs the provided async function (`Func`) with the request, response, and next objects
    // It wraps the function call in `Promise.resolve()` to handle both synchronous and asynchronous functions
    // If the function throws an error, `catch(next)` ensures the error is passed to the next middleware
    Promise.resolve(Func(req, res, next)).catch(next);
};

```

> Purpose of CatchAsyncError: This utility function is designed to simplify error handling in asynchronous route handlers. Instead of manually wrapping each async function in a try-catch block, you can use this function to automatically catch errors and pass them to your Express error-handling middleware.

### How It Works

> CatchAsyncError takes an async function Func as an argument.
>
> It returns a new function that, when called with req, res, and next, will execute the Func function.
>
> Promise.resolve() ensures that even if Func is a synchronous function, it will still be treated as a promise.
>
> If Func throws an error or returns a rejected promise, catch(next) will pass the error to Express's next() function, triggering the error-handling middleware.

<br><br><br>

## Explanation ErrorMiddleware

```typescript

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

```

> Purpose of ErrorMiddleware: This middleware is designed to handle and respond to errors that occur in your Express application. It catches various types of errors, such as invalid MongoDB ObjectId, duplicate keys, and issues related to JSON Web Tokens (JWT), and provides a standardized error response.

### How It Works

> The middleware first ensures that a default status code (500) and message (Internal server error) are set if they are not already defined in the error object.
>
> It then checks the type of error using the err.name or err.code properties and customizes the error message and status code based on the specific error type.
>
> The custom ErrorHandler utility is used to create consistent error objects.
>
> Finally, the middleware sends a JSON response with the error's status code and message, which is sent back to the client to inform them of what went wrong.

#### This middleware should be added as the last middleware in your Express application so that it can catch any errors that were not handled by previous middlewares or routes

<br><br><br>

## Explanation on UserModel

```typescript
// Import necessary modules from Mongoose for defining schemas and models
import mongoose, { Document, Model, Schema } from "mongoose";

// Import bcryptjs for hashing and comparing passwords
import bcryptjs from "bcryptjs";

// Regular expression pattern for validating email format
const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Interface for the User model defining the shape of the user document in MongoDB
export interface UserModelInterface extends Document {
    name: string; // User's name
    email: string; // User's email
    password: string; // User's password (hashed)
    avatar?: {  // Optional avatar object containing public_id and url
        public_id: string;
        url: string;
    };
    role: string; // User's role, default is "user"
    isVerified: boolean; // Boolean indicating if the user's email is verified
    courses?: Array<{ courseId: string }>; // Optional array of courses the user is enrolled in
    comparePassword: (password: string) => Promise<boolean>; // Method to compare passwords
}

// Define the user schema with fields and validation
const userSchema: Schema<UserModelInterface> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"], // Name is required with a custom error message
    },
    email: {
        type: String,
        required: [true, "Please enter your email"], // Email is required with a custom error message
        validate: {
            // Custom validator using the email regex pattern
            validator: function (value: string) {
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid email" // Custom error message for invalid email
        },
        unique: true // Ensure email is unique across all users
    },
    password: {
        type: String,
        required: [true, "Please enter your password"], // Password is required with a custom error message
        minlength: [6, "Please enter at least 6 characters"], // Minimum password length is 6 characters
        select: false // Do not return the password field by default when querying the user
    },
    avatar: {
        public_id: { type: String }, // Optional public_id for the user's avatar
        url: { type: String }, // Optional URL for the user's avatar
    },
    role: {
        type: String,
        default: "user" // Default role is "user"
    },
    isVerified: {
        type: Boolean,
        default: false, // Default verification status is false (not verified)
    },
    courses: [
        {
            courseId: { type: String }, // Optional array of course IDs the user is enrolled in
        }
    ],
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields to the schema
});

// Pre-save middleware to hash the user's password before saving it to the database
userSchema.pre<UserModelInterface>('save', async function (next) {
    // Only hash the password if it has been modified or is new
    if (!this.isModified('password')) {
        return next(); // Skip hashing if the password hasn't changed
    }

    // Hash the password with bcryptjs using a salt round of 10
    this.password = await bcryptjs.hash(this.password, 10);

    next(); // Call next() to proceed with saving the user
});

// Method to compare the entered password with the hashed password in the database
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    // Use bcryptjs to compare the entered password with the stored hashed password
    return await bcryptjs.compare(enteredPassword, this.password);
};

// Create the User model from the userSchema and export it for use in the application
const userModel: Model<UserModelInterface> = mongoose.model("User", userSchema);

export default userModel;
```

> UserModelInterface: This interface defines the structure of a user document in MongoDB. It includes fields like name, email, password, and methods like comparePassword.

> userSchema: The schema defines the structure of the user collection in MongoDB, including required fields, validation, and default values.

> userSchema.pre('save'): This is a pre-save middleware that hashes the user's password before saving it to the database, ensuring that plain-text passwords are never stored.

> comparePassword method: This method allows for comparison between the plain-text password provided by the user during login and the hashed password stored in the database.

> Model Creation: The userModel is created from the schema and exported for use throughout the application to interact with the user collection in MongoDB.

<br><br><br>

## Explanation on connecting MongoDB

```typescript
// Import the mongoose library, which provides a way to interact with MongoDB
import mongoose from "mongoose";

// Load environment variables from a .env file into process.env
require("dotenv").config();

// Retrieve the database connection string from environment variables
// If the DB_STRING is not defined, use an empty string as a fallback
const DB_STRING: string = process.env.DB_STRING || '';

// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Attempt to connect to the database using the mongoose.connect method
        // The connection string is passed from the environment variables
        await mongoose.connect(DB_STRING).then((data: any) => {
            // If the connection is successful, log a message indicating the connection along with the server port
            console.log(`DB connected with port ${process.env.PORT}`);
        });
    } catch (error: any) {
        // If an error occurs during the connection attempt, log the error message
        console.log("error.message =>", error.message);
        // Attempt to reconnect after 5 seconds if the connection fails
        setTimeout(connectDB, 5000);
    }
};

// Export the connectDB function as the default export for use in other parts of the application
export default connectDB;

```

> DB_STRING: This variable stores the MongoDB connection string, which is fetched from the environment variables. If it's not defined, it defaults to an empty string.

> connectDB function: This asynchronous function handles the connection to the MongoDB database using Mongoose. It is designed to retry the connection if it fails, making it more resilient to temporary network issues.

> Error Handling: If the connection fails, the function logs the error message and waits for 5 seconds before attempting to reconnect. This ensures that the application keeps trying to connect to the database even if there are temporary issues.

> Export: The connectDB function is exported as the default export so it can be easily imported and used in other parts of the application, typically in the main server file where the connection to the database is established when the server starts.

require("dotenv").config()


// Import necessary modules from Mongoose for defining schemas and models
import mongoose, { Document, Model, Schema } from "mongoose";

// Import bcryptjs for hashing and comparing passwords
import bcryptjs from "bcryptjs";


import jwt from "jsonwebtoken";

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
    SignAccessToken: () => string
    SignRefreshToken: () => string
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
        // required: [true, "Please enter your password"], // Password is required with a custom error message
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





// This method is used to create an access token when a user logs in.

// The token is signed with the user's ID and a secret key, using the JWT (JSON Web Token) library.
userSchema.methods.SignAccessToken = function () {
    // The `id` payload contains the user's unique identifier (`_id`).

    // {"
    // _id":{
    // "$oid":"66bd1186103b76f3c27ddadc", here is the id
    // "name":"orochimaru",
    // "email":"adedamolacopy@gmail.com
    // "password":"$2a$10$r0txoQtjKHY9k6ifQysL6.InARQb5/F8MHK27/9j95dYBdjvirazC",
    // "role":"user",
    // "isVerified":false,
    // "courses":[],
    // "createdAt":{"$date":{"$numberLong":"1723666822067"
    // "updatedAt":{"$date":{"$numberLong":"1723666822067"},
    // "__v":{"$numberInt":"0"}
    // }


    // The token is signed using the secret key stored in the environment variable `ACCESS_TOKEN`.
    // If `ACCESS_TOKEN` is not defined, it defaults to an empty string.
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || '', {
        expiresIn: "5m"
    });
};

// This method is used to create a refresh token for the user.

// Refresh tokens are used to obtain a new access token without requiring the user to log in again.
userSchema.methods.SignRefreshToken = function () {
    // Similar to the access token, the refresh token is signed with the user's ID.

    // The secret key for the refresh token is stored in the environment variable `REFRESH_TOKEN`.

    // If `REFRESH_TOKEN` is not defined, it defaults to an empty string.
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || '', {
        expiresIn: "3d"
    });
};


// Method to compare the entered password with the hashed password in the database
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    // Use bcryptjs to compare the entered password with the stored hashed password
    return await bcryptjs.compare(enteredPassword, this.password);
};

// Create the User model from the userSchema and export it for use in the application
const userModel: Model<UserModelInterface> = mongoose.model("User", userSchema);

export default userModel;

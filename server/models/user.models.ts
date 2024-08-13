import mongoose, { Document, Model, Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface IUser extends Document {
    name: string
    email: string
    password: string
    avatar: {
        public_id: string
        url: string
    },
    role: string
    isVerified: boolean
    courses: Array<{ courseId: string }>
    comparePassword: (password: string) => Promise<boolean>
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: function (value: string) {
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid email"
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Please enter at least 6 charactera"],
        select: false
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            courseId: String,
        }
    ],

}, {
    timestamps: true
} // this adds two fiels, created at and update at
) 
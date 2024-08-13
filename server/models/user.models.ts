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


// hash user password before saving it
userSchema.pre<IUser>('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next(); // Skip hashing if the password hasn't changed
    }

    // Hash the password with a salt round of 10
    this.password = await bcryptjs.hash(this.password, 10);

    next(); // Call next() after hashing
});


// compare password
userSchema.methods.comparePassword = async function(enterdPassword: string): Promise<boolean> {
    return await bcryptjs.compare(enterdPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel
import { Response } from "express";
import { redis } from "../utils/redis";
import userModel from "../models/user.models";




// get user by id
export const getUserById = async (id: string, res: Response) => {
    // Find the user in the database using the provided user ID
    const userJson = await redis.get(id);

    if (userJson) {
        const user = JSON.parse(userJson);
        // Send a JSON response with a success status and the retrieved user data
        res.status(201).json({
            success: true,
            user,
        });
    }


};


// get all users
export const getAllUsersService = async (res: Response) => {
    const users = await userModel.find().sort({createdAt: -1})

    res.status(201).json({
        success: true,
        users,
    });
}

// update user role
export const updateUserRoleService = async (res: Response, id: string, role: string) => {
    const users = await userModel.findByIdAndUpdate(id, {role}, {new: true})

    res.status(201).json({
        success: true,
        users,
    });
}

import { Response } from "express";
import userModel from "../models/user.models";




// get user by id
export const getUserById = async (id: string, res: Response) => {
    // Find the user in the database using the provided user ID
    const user = await userModel.findById(id);

    // Send a JSON response with a success status and the retrieved user data
    res.status(201).json({
        success: true,
        user,
    });
};

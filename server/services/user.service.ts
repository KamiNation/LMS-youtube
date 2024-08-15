import { Response } from "express";
import { redis } from "../utils/redis";




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

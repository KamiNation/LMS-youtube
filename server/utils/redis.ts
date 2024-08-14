// Import the ioredis library for interacting with Redis
import Redis from "ioredis";

// Load environment variables from a .env file into process.env
require('dotenv').config();

// Function to handle the Redis client connection
const redisClient = () => {
    // Check if the REDIS_URL environment variable is defined
    if (process.env.REDIS_URL) {
        console.log("Redis Connected"); // Log a message indicating a successful connection
        return process.env.REDIS_URL; // Return the Redis URL to establish the connection
    }
    // If REDIS_URL is not defined, throw an error indicating the connection failed
    throw new Error("Redis Connection Failed");
}

// Create a new Redis instance using the connection URL returned by redisClient
export const redis = new Redis(redisClient());

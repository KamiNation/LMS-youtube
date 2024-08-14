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

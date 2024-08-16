
import { app } from "./app";
import {v2 as cloudinary} from "cloudinary"
import connectDB from "./utils/db";
require("dotenv").config();

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
})



// Create server
app.listen(process.env.PORT, () => {
    try {
        console.log(`Server is connected http://localhost/${process.env.PORT}`);
        connectDB()
    } catch (error: any) {
        console.log(error.message);
    }
})


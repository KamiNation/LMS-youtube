
import mongoose from "mongoose"
require("dotenv").config()


const DB_STRING: string = process.env.DB_STRING || ''


const connectDB = async () => {
    try {
        await mongoose.connect(DB_STRING).then((data: any) => {
            console.log(`DB connected with port ${process.env.PORT}`);
        })
    } catch (error: any) {
        console.log("error.message =>", error.message);
        setTimeout(connectDB, 5000);
    }
} 


export default connectDB
import { app } from "./app";
import connectDB from "./utils/db";
require("dotenv").config();


// Create server
app.listen(process.env.PORT, () => {
    try {
        console.log(`Server is connected http://localhost/${process.env.PORT}`);
        connectDB()
    } catch (error: any) {
        console.log(error.message);
    }
})


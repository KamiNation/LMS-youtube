require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { UserModelInterface } from "../models/user.models";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs"
import path from "path"
import sendMail from "../utils/sendMail";



// Register user controller interface
interface userRegControllerInterface {
    name: string
    email: string
    password: string
    avatar?: string
}

export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        console.log("registrationUser controller hit");
        

        const { name, email, password } = req.body
        console.log("name =>", name);
        console.log("email =>", email);
        console.log("password =>", password,);
        
        

        // Check for existing email
        const isEmailExist = await userModel.findOne({ email })
        if (isEmailExist) {
            return next(new ErrorHandler("Email already exist", 400))
        }

        // create user object
        const user: userRegControllerInterface = {
            name,
            email,
            password
        }

        // create activationToken variable
        const activationToken = activationTokenHandler(user)
        console.log("activationToken =>", activationToken);
        

        // send code to users email by getting it from activationToken
        const activationCode = activationToken.activationCode
        console.log("activationCode =>", activationCode);
        
        const data = { user: { name: user.name }, activationCode }
        console.log("data =>", data);
        
        // const htmls = await ejs.renderFile(path.join(__dirname, "../mails/activation-email.ejs"), data)
        // console.log("html from regcontroller =>", htmls);
        
        // console.log("User object =>", user);
        


        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                template: "activation-email.ejs",
                data
            })

            res.status(201).json({
                success: true,
                message: `Please check your mail ${user.email} to activate your account`,
                // we need the activation token in front end
                activationToken: activationToken.token
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.messsage, 400))
        }


    } catch (error: any) {
        return next(new ErrorHandler(error.messsage, 400))
    }
})


// interface for user activation token
interface userActivationToken {
    token: string,
    activationCode: string
}

export const activationTokenHandler = (user: userRegControllerInterface): userActivationToken => {

    const activationCode = Math.floor(1000 * Math.random() * 9000).toString();

    const token = jwt.sign({
        user,
        activationCode
    }, process.env.ACTIVATION_SECRET as Secret, { expiresIn: "5m" }
    )

    return {
        token,
        activationCode
    }
}
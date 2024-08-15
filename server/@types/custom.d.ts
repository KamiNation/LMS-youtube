import { Request } from "express-jwt";
import { UserModelInterface } from "../models/user.models";

declare global {
    namespace Express {
        interface Request{
            user?: UserModelInterface
        }
    }
}
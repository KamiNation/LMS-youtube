import { NextFunction, Request, Response } from "express";

export const CatchAsyncError = (Func: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(Func(req, res, next)).catch(next);
};
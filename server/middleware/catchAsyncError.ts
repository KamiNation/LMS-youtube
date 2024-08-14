// Import types from Express: Request, Response, and NextFunction, 
// which represent the request, response, and next middleware function respectively
import { NextFunction, Request, Response } from "express";

// Define a higher-order function `CatchAsyncError` that takes an async function `Func` as an argument
// It returns a new function that automatically catches any errors thrown in the async function 
// and passes them to the next middleware (error handler)
export const CatchAsyncError = (Func: any) => (req: Request, res: Response, next: NextFunction) => {
    // The returned function runs the provided async function (`Func`) with the request, response, and next objects
    // It wraps the function call in `Promise.resolve()` to handle both synchronous and asynchronous functions
    // If the function throws an error, `catch(next)` ensures the error is passed to the next middleware
    Promise.resolve(Func(req, res, next)).catch(next);
};

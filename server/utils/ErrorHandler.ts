// This file handles error that we might come across in our appliation by creating a class for it


class ErrorHandler extends Error {
    statusCode: Number
    constructor(message: any, statusCode: Number){
        super(message);
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor)
    }
}

export  default ErrorHandler
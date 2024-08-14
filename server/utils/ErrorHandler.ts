// This file handles errors that we might encounter in our application by creating a custom error handling class

// Define a custom error class `ErrorHandler` that extends the built-in `Error` class
class ErrorHandler extends Error {
    // `statusCode` will store the HTTP status code associated with the error
    statusCode: Number;

    // The constructor takes two parameters: the error message and the HTTP status code
    constructor(message: any, statusCode: Number) {
        // Call the parent `Error` class constructor with the error message
        super(message);
        
        // Set the status code for this error instance
        this.statusCode = statusCode;

        // Capture the stack trace for this error, excluding the constructor call
        Error.captureStackTrace(this, this.constructor);
    }
}

// Export the `ErrorHandler` class as the default export for use in other parts of the application
export default ErrorHandler;

// Custom error class to handle API errors uniformly across the application
class ApiError extends Error {
constructor( 
    statusCode,//HTTP status code
    message ="Something went wrong",//Error message and default message
    errors =[],//Array of specific error details
    stack=""//Stack trace for debugging
){
    super(message); //calling parent class constructor
    this.statusCode = statusCode;//setting status code
    this.data = null;//no data in error response
    this.message = message;//setting error message
    this.success = false;//indicating failure and setting success to false
    this.errors = errors;  //setting specific error details

    //capturing stack trace if provided
    if (stack){
        this.stack = stack;
    } else {
        Error.captureStackTrace(this, this.constructor);}//capturing stack trace for debugging 
}
}

export { ApiError } //exporting ApiError class


export const errorHandler=(statusCode,message)=>{
    const error= new Error()   // Error Constructor
    error.statusCode=statusCode;
    error.message=message;
    return error;
}
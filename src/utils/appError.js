class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; //flag that its an operational error, not a code bug error
    //It prevents this class to appear on stack trace (where error occured log)
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

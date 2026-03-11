import ApiError from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {

  // If the error is our custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // If error has statusCode property
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Fallback
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
  
};

export default errorMiddleware;
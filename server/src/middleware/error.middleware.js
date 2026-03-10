import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
  // Preserve explicit status codes
  let statusCode = 500;

  if (typeof err.statusCode === "number") {
    statusCode = err.statusCode;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
  }

  const message = err.message || "Internal Server Error";

  // Log unexpected errors
  if (statusCode === 500) {
    logger.error(err);
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Resource already exists",
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
};

export default errorMiddleware;

import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log unexpected errors
  if (!(err instanceof ApiError)) {
    logger.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;

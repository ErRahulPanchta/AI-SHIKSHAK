import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (!(err instanceof ApiError)) {
    logger.error(err.message);
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};

export default errorMiddleware;
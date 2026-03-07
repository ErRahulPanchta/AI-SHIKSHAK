import ApiError from "../utils/ApiError.js";
import User from "../modules/user/user.model.js";

const roleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user?.id) {
      return next(new ApiError(401, "Unauthorized"));
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(new ApiError(403, "Forbidden: Insufficient permissions"));
    }

    next();
  };
};

export default roleMiddleware;

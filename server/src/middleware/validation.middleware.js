import ApiError from "../utils/ApiError.js";

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(", ");
      return next(new ApiError(400, message));
    }

    if (result.data.body) {
      req.body = result.data.body;
    }

    next();
  };
};

export default validate;

import ApiError from "../utils/ApiError.js";

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });

      req.body = result.body;
      req.params = result.params;
      req.query = result.query;

      next();
    } catch (error) {
      const message = error.errors?.map((e) => e.message).join(", ");

      next(new ApiError(400, message || "Validation error"));
    }
  };
};

export default validate;
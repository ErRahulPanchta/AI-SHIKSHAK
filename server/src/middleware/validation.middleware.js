import ApiError from "../utils/ApiError.js";

const validate = (schema) => (req, res, next) => {

  // detect schema type
  const expectsStructuredInput =
    schema.shape?.body || schema.shape?.params || schema.shape?.query;

  const data = expectsStructuredInput
    ? {
        body: req.body || {},
        params: req.params || {},
        query: req.query || {},
      }
    : req.body;

  const result = schema.safeParse(data);

  if (!result.success) {
    const message = result.error.issues.map(i => i.message).join(", ");
    return next(new ApiError(400, message));
  }

  // assign parsed data safely
if (expectsStructuredInput) {
  if (result.data.body) req.body = result.data.body;
  if (result.data.params) req.params = result.data.params;
  // do NOT reassign req.query
} else {
  req.body = result.data;
}

  next();
};

export default validate;
import xss from "xss";

export const xssMiddleware = (req, res, next) => {
  if (req.body) {
    req.body = JSON.parse(JSON.stringify(req.body), (key, value) =>
      typeof value === "string" ? xss(value) : value,
    );
  }

  next();
};

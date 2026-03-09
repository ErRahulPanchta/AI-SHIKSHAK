import hpp from "hpp";

const hppMiddleware = hpp({
  whitelist: ["page", "limit", "tag", "category"],
});

export default hppMiddleware;

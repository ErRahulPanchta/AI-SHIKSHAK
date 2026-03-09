import { incrementView } from "../modules/analytics/view.service.js";

const viewMiddleware = async (req, res, next) => {
  try {
    const blog = res.locals.blog;

    if (blog) {
      await incrementView(blog._id);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default viewMiddleware;

import request from "supertest";
import app from "../../src/app.js";

import { createUserAndToken, createCategory, createBlog } from "../blog/testUtils.js";
import Comment from "../../src/modules/comment/comment.model.js";

describe("Like Comment", () => {

  it("should like comment", async () => {

    const { user, token } = await createUserAndToken();

    const category = await createCategory();
    const blog = await createBlog(user._id, category._id);

    blog.status = "approved";
    await blog.save();

    const comment = await Comment.create({
      blog: blog._id,
      author: user._id,
      content: "Nice blog"
    });

    const res = await request(app)
      .post(`/api/comments/${comment._id}/like`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

});
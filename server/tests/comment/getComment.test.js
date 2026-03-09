import request from "supertest";
import app from "../../src/app.js";
import { jest } from "@jest/globals";


import { createUserAndToken, createCategory, createBlog } from "../blog/testUtils.js";
import Comment from "../../src/modules/comment/comment.model.js";

jest.setTimeout(20000);
describe("Get Blog Comments", () => {

  it("should return blog comments", async () => {

    const { user } = await createUserAndToken();

    const category = await createCategory();
    const blog = await createBlog(user._id, category._id);

    blog.status = "approved";
    await blog.save();

    await Comment.create({
      blog: blog._id,
      author: user._id,
      content: "Nice article"
    });

    const res = await request(app)
      .get(`/api/blogs/${blog._id}/comments`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);

  });

});
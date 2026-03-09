import request from "supertest";
import app from "../../src/app.js";
import { jest } from "@jest/globals";


import { createUserAndToken, createCategory, createBlog } from "../blog/testUtils.js";
import Comment from "../../src/modules/comment/comment.model.js";

jest.setTimeout(20000);
describe("Reply Comment", () => {

  it("should reply to comment", async () => {

    const { user, token } = await createUserAndToken();

    const category = await createCategory();
    const blog = await createBlog(user._id, category._id);

    blog.status = "approved";
    await blog.save();

    const parent = await Comment.create({
      blog: blog._id,
      author: user._id,
      content: "First comment"
    });

    const res = await request(app)
      .post(`/api/comments/${parent._id}/reply`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Reply comment"
      });

    expect(res.statusCode).toBe(201);

  });

});
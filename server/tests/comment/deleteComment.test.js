import request from "supertest";
import app from "../../src/app.js";
import { jest } from "@jest/globals";


import { createUserAndToken, createCategory, createBlog } from "../blog/testUtils.js";
import Comment from "../../src/modules/comment/comment.model.js";

jest.setTimeout(20000);
describe("Delete Comment", () => {

  it("should delete comment", async () => {

    const { user, token } = await createUserAndToken();

    const category = await createCategory();
    const blog = await createBlog(user._id, category._id);

    blog.status = "approved";
    await blog.save();

    const comment = await Comment.create({
      blog: blog._id,
      author: user._id,
      content: "Delete this comment"
    });

    const res = await request(app)
      .delete(`/api/comments/${comment._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

  });

});
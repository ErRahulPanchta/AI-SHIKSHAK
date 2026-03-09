import request from "supertest";
import app from "../../src/app.js";
import { jest } from "@jest/globals";


import { createUserAndToken, createCategory, createBlog } from "../blog/testUtils.js";

jest.setTimeout(20000);
describe("Create Comment", () => {

  it("should create comment on blog", async () => {

    const { user, token } = await createUserAndToken();
    const category = await createCategory();
    const blog = await createBlog(user._id, category._id);

    blog.status = "approved";
    await blog.save();

    const res = await request(app)
      .post(`/api/blogs/${blog._id}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Great blog!"
      });

    expect(res.statusCode).toBe(201);

  });

});
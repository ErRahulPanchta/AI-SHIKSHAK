import request from "supertest";
import app from "../../src/app.js";
import { jest } from "@jest/globals";
import { createUserAndToken, createCategory, createBlog } from "./testUtils.js";

jest.setTimeout(20000);
describe("Update Blog", () => {

  it("should update blog title", async () => {

    const { user, token } = await createUserAndToken();
    const category = await createCategory();
    const blog = await createBlog(user._id, category._id);

    const res = await request(app)
      .patch(`/api/blogs/${blog._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Blog Title" });

    expect(res.statusCode).toBe(200);

  });

});
import request from "supertest";
import app from "../../src/app.js";
import { jest } from "@jest/globals";
import { createUserAndToken, createCategory, createBlog } from "./testUtils.js";

jest.setTimeout(20000);
describe("Get Blog By Slug", () => {
  it("should fetch blog", async () => {
    const { user } = await createUserAndToken();
    const category = await createCategory();

    const blog = await createBlog(user._id, category._id);

    // approve blog so public endpoint can access it
    blog.status = "approved";
    await blog.save();

    const res = await request(app).get(`/api/blogs/${blog.slug}`);

    expect(res.statusCode).toBe(200);
  });
});

import request from "supertest";
import app from "../../src/app.js";
import { jest } from "@jest/globals";
import { createUserAndToken, createCategory, createBlog } from "./testUtils.js";

jest.setTimeout(20000);
describe("Like Blog", () => {

  it("should like blog", async () => {

    const { user, token } = await createUserAndToken();
    const category = await createCategory();
    const blog = await createBlog(user._id, category._id);

    const res = await request(app)
      .post(`/api/blogs/${blog._id}/like`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

  });

});
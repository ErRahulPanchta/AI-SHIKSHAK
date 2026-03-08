import request from "supertest";
import app from "../../src/app.js";

import { createUserAndToken, createCategory, createBlog } from "./testUtils.js";

describe("Delete Blog", () => {

  it("should delete blog", async () => {

    const { user, token } = await createUserAndToken();
    const category = await createCategory();
    const blog = await createBlog(user._id, category._id);

    const res = await request(app)
      .delete(`/api/blogs/${blog._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

  });

});
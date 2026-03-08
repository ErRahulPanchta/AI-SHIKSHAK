import request from "supertest";
import app from "../../src/app.js";

import { createUserAndToken, createCategory, createBlog } from "./testUtils.js";

describe("Approve Blog", () => {

  it("admin should approve blog", async () => {

    const { user } = await createUserAndToken();
    const { token } = await createUserAndToken("admin");

    const category = await createCategory();
    const blog = await createBlog(user._id, category._id);

    const res = await request(app)
      .patch(`/api/blogs/admin/${blog._id}/approve`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

  });

});
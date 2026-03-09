import request from "supertest";
import app from "../../src/app.js";
import { jest } from "@jest/globals";
import { createUserAndToken, createCategory, createBlog } from "./testUtils.js";

jest.setTimeout(20000);
describe("Reject Blog", () => {

  it("admin should reject blog", async () => {

    const { user } = await createUserAndToken();
    const { token } = await createUserAndToken("admin");

    const category = await createCategory();
    const blog = await createBlog(user._id, category._id);

    const res = await request(app)
      .patch(`/api/blogs/admin/${blog._id}/reject`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rejectionReason: "Low quality" });

    expect(res.statusCode).toBe(200);

  });

});
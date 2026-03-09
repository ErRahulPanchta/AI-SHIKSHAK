import request from "supertest";
import app from "../../src/app.js";
import { jest } from "@jest/globals";
import { createUserAndToken, createCategory } from "./testUtils.js";

jest.setTimeout(20000);
describe("Create Blog", () => {
  it("should create blog with valid data", async () => {
    const { token } = await createUserAndToken();
    const category = await createCategory();

    const res = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "AI Basics",
        category: category._id,
        content: [
          { type: "paragraph", text: "Artificial intelligence basics" },
        ],
      });

    expect(res.statusCode).toBe(201);
  });

  it("should fail if title missing", async () => {
    const { token } = await createUserAndToken();

    const res = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: [{ type: "paragraph", text: "Test" }],
      });

    expect(res.statusCode).toBe(400);
  });
});

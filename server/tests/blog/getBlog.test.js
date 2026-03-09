import request from "supertest";
import app from "../../src/app.js";
import { jest } from "@jest/globals";
jest.setTimeout(20000);
describe("Get Blogs", () => {

  it("should return blogs list", async () => {

    const res = await request(app).get("/api/blogs");

    expect(res.statusCode).toBe(200);

  });

});
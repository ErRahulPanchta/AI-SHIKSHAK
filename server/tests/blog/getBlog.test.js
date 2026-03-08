import request from "supertest";
import app from "../../src/app.js";

describe("Get Blogs", () => {

  it("should return blogs list", async () => {

    const res = await request(app).get("/api/blogs");

    expect(res.statusCode).toBe(200);

  });

});
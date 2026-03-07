import { jest } from "@jest/globals";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../src/app.js";
import User from "../../src/modules/user/user.model.js";

jest.setTimeout(20000);

describe("Auth API", () => {
  beforeEach(async () => {
    await User.create({
      name: "Me User",
      email: "me@test.com",
      password: "123456789",
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("GET /api/auth/me", () => {
    it("should return authenticated user", async () => {
      const login = await request(app).post("/api/auth/login").send({
        email: "me@test.com",
        password: "123456789",
      });

      const cookies = login.headers["set-cookie"];

      const res = await request(app).get("/api/auth/me").set("Cookie", cookies);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

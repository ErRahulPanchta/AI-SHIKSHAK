import { jest } from "@jest/globals";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../src/app.js";
import User from "../../src/modules/user/user.model.js";

jest.setTimeout(20000);

describe("Auth API", () => {
  beforeEach(async () => {
    await User.create({
      name: "Logout User",
      email: "logout@test.com",
      password: "123456789",
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/logout", () => {
    it("should logout user successfully", async () => {
      const login = await request(app).post("/api/auth/login").send({
        email: "logout@test.com",
        password: "123456789",
      });

      const cookies = login.headers["set-cookie"];

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", cookies);

      expect(res.statusCode).toBe(200);
    });
  });
});

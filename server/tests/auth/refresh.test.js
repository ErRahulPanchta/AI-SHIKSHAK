import { jest } from "@jest/globals";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../src/app.js";
import User from "../../src/modules/user/user.model.js";

jest.setTimeout(20000);

describe("Auth API", () => {

  beforeEach(async () => {

    

    await User.create({
      name: "Refresh User",
      email: "refresh@test.com",
      password:"123456789"
    });

  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/refresh", () => {

    it("should generate new access token", async () => {

      const login = await request(app)
        .post("/api/auth/login")
        .send({
          email: "refresh@test.com",
          password: "123456789"
        });

      const cookies = login.headers["set-cookie"];

      const res = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", cookies);

      expect(res.statusCode).toBe(200);

    });

  });

});
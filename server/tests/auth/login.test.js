import { jest } from "@jest/globals";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../src/app.js";
import User from "../../src/modules/user/user.model.js";

jest.setTimeout(20000);

describe("Auth API", () => {

  beforeEach(async () => {

    const hashedPassword = await bcrypt.hash("123456789", 10);

    await User.create({
      name: "Test User",
      email: "example1@example.com",
      password: hashedPassword
    });

  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/login", () => {

    it("should login successfully", async () => {

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "example1@example.com",
          password: "123456789"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // ensure cookies were set
      expect(res.headers["set-cookie"]).toBeDefined();

    });


    it("should fail if password is incorrect", async () => {

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "example1@example.com",
          password: "wrongpassword"
        });

      expect(res.statusCode).toBe(401);

    });


    it("should fail if user does not exist", async () => {

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nouser@example.com",
          password: "123456789"
        });

      expect(res.statusCode).toBe(404);

    });

  });

});
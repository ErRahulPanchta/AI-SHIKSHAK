import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/modules/user/user.model.js";

jest.setTimeout(20000);

describe("Auth API", () => {

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/register", () => {

    it("should register a new user", async () => {

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: `user${Date.now()}@example.com`,
          password: "123456789"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);

    });


    it("should fail if email already exists", async () => {

      const user = {
        name: "Rahul",
        email: "duplicate@example.com",
        password: "123456789"
      };

      await request(app).post("/api/auth/register").send(user);

      const res = await request(app).post("/api/auth/register").send(user);

      expect(res.statusCode).toBe(409);

    });


    it("should fail if password is too short", async () => {

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "shortpass@example.com",
          password: "123"
        });

      expect(res.statusCode).toBe(400);

    });

  });

});
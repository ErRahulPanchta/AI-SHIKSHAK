import { jest } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";

jest.setTimeout(10000);

describe("Auth API", () => {
  describe("POST /api/auth/register", () => {
    //test 1
    it("should register a new user", async () => {

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: `test${Date.now()}@example.com`,
          password: "123456789"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);

    });

    //test 2
    /* it("should fail if email already exists", async () => {
      const user = {
        name: "Rahul",
        email: `dup${Date.now()}@test.com`,
        password: "12345678",
      };

      await request(app).post("/api/auth/register").send(user);

      const res = await request(app).post("/api/auth/register").send(user);

      expect(res.statusCode).toBe(409);
    }); */

    //test 3
   /* it("should fail if password is too short", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Rahul",
        email: "test@email.com",
        password: "123",
      });

      expect(res.statusCode).toBe(400);
    }); */

  });
});

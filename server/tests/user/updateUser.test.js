import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/modules/user/user.model.js";

jest.setTimeout(20000);

describe("User API", () => {

  let cookies;

  beforeEach(async () => {

    await User.create({
      name: "Test User",
      email: "profile@test.com",
      password: "123456789",
    });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "profile@test.com",
        password: "123456789",
      });

    cookies = login.headers["set-cookie"];
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("PATCH /api/users/me", () => {

    it("should update profile successfully", async () => {

      const res = await request(app)
        .patch("/api/users/me")
        .set("Cookie", cookies)
        .send({
          name: "Updated Name",
          bio: "AI writer",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const updatedUser = await User.findOne({ email: "profile@test.com" });

      expect(updatedUser.name).toBe("Updated Name");
      expect(updatedUser.bio).toBe("AI writer");
    });

  });

});
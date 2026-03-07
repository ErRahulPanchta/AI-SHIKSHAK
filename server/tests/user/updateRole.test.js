import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/modules/user/user.model.js";

jest.setTimeout(20000);

describe("User Role API", () => {
  let adminCookies;
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      name: "Normal User",
      email: "user@test.com",
      password: "123456789",
    });

    userId = user._id;

    await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: "123456789",
      role: "admin",
    });

    const login = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "123456789",
    });

    adminCookies = login.headers["set-cookie"];
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("PATCH /api/users/:id/role", () => {
    it("should allow admin to update user role", async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}/role`)
        .set("Cookie", adminCookies)
        .send({ role: "admin" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const updatedUser = await User.findById(userId);

      expect(updatedUser.role).toBe("admin");
    });

    it("should fail if role is invalid", async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}/role`)
        .set("Cookie", adminCookies)
        .send({ role: "invalid-role" });

      expect(res.statusCode).toBe(400);
    });

    it("should fail if user does not exist", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const res = await request(app)
        .patch(`/api/users/${fakeId}/role`)
        .set("Cookie", adminCookies)
        .send({ role: "admin" });

      expect(res.statusCode).toBe(404);
    });
  });
});

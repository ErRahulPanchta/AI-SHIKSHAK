import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/modules/user/user.model.js";

jest.setTimeout(20000);

describe("User Delete API", () => {

  let adminCookies;
  let userId;

  beforeEach(async () => {

    const user = await User.create({
      name: "Delete User",
      email: "delete@test.com",
      password: "123456789",
    });

    userId = user._id;

    await User.create({
      name: "Admin",
      email: "admin@test.com",
      password: "123456789",
      role: "admin",
    });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test.com",
        password: "123456789",
      });

    adminCookies = login.headers["set-cookie"];
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("DELETE /api/users/:id", () => {

    it("should delete user successfully", async () => {

      const res = await request(app)
        .delete(`/api/users/${userId}`)
        .set("Cookie", adminCookies);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const deletedUser = await User.findById(userId);

      expect(deletedUser).toBeNull();
    });

  });

});
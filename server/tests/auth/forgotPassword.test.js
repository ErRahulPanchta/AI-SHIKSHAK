import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/modules/user/user.model.js";

describe("Forgot Password", () => {

  beforeEach(async () => {
    await User.create({
      name: "Test",
      email: "test@example.com",
      password: "123456789",
    });
  });

  it("should send OTP", async () => {

    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "test@example.com" });

    expect(res.statusCode).toBe(200);
  });

});
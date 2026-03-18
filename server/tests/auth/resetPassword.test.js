import request from "supertest";
import app from "../../src/app.js";
import OTP from "../../src/modules/auth/otp.model.js";
import User from "../../src/modules/user/user.model.js";

describe("Reset Password", () => {

  afterEach(async () => {
    await User.deleteMany({});
    await OTP.deleteMany({});
  });

  it("should reset password", async () => {

    const email = "test@example.com";

    // create user
    await User.create({
      name: "Test User",
      email,
      password: "123456789",
    });

    // create verified reset OTP
    await OTP.create({
      email,
      otp: "123456",
      type: "reset",
      verified: true,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email,
        otp: "123456",
        newPassword: "newpassword123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

  });

});
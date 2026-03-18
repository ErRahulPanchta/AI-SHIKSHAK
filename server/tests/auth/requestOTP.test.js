import request from "supertest";
import app from "../../src/app.js";

describe("Request OTP", () => {

  it("should send OTP", async () => {

    const res = await request(app)
      .post("/api/auth/request-otp")
      .send({ email: "test@example.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

  });

});
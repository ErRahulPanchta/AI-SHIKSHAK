import { jest } from "@jest/globals";
import path from "path";

/*
 Mock Cloudinary BEFORE importing app
*/
jest.unstable_mockModule("cloudinary", () => ({
  v2: {
    uploader: {
      upload_stream: (options, callback) => {
        return {
          end: () =>
            callback(null, {
              secure_url: "https://mock-cloudinary/avatar.jpg",
            }),
        };
      },
    },
  },
}));

/*
 Dynamically import modules AFTER mock
*/
const { default: request } = await import("supertest");
const { default: app } = await import("../../src/app.js");
const { default: User } = await import("../../src/modules/user/user.model.js");

jest.setTimeout(20000);

describe("User Avatar Upload API", () => {

  let cookies;
  const filePath = path.join(process.cwd(), "tests/assets/avatar.jpg");

  beforeEach(async () => {

    await User.create({
      name: "Avatar User",
      email: "avatar@test.com",
      password: "123456789",
    });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "avatar@test.com",
        password: "123456789",
      });

    cookies = login.headers["set-cookie"];
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("PATCH /api/users/avatar", () => {

    it("should upload avatar successfully", async () => {

      const res = await request(app)
        .patch("/api/users/avatar")
        .set("Cookie", cookies)
        .attach("avatar", filePath);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const user = await User.findOne({ email: "avatar@test.com" });

      expect(user.avatar).toBeDefined();
      expect(user.avatar).toContain("mock-cloudinary");
    });

    it("should fail if no file uploaded", async () => {

      const res = await request(app)
        .patch("/api/users/avatar")
        .set("Cookie", cookies);

      expect(res.statusCode).toBe(400);
    });

  });

});
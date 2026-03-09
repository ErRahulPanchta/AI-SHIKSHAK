import request from "supertest";
import app from "../../src/app.js";
import { createUserAndToken } from "../blog/testUtils.js";
import { jest } from "@jest/globals";


jest.setTimeout(20000);
describe("Create Category", () => {

  it("admin should create category", async () => {

    const { token } = await createUserAndToken("admin");

    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Artificial Intelligence",
        description: "AI related blogs"
      });

    expect(res.statusCode).toBe(201);

  });

  it("should fail without name", async () => {

    const { token } = await createUserAndToken("admin");

    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);

  });

});
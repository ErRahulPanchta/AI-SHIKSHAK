import request from "supertest";
import app from "../../src/app.js";
import Category from "../../src/modules/category/category.model.js";
import { jest } from "@jest/globals";


jest.setTimeout(20000);
describe("Get Categories", () => {

  it("should return categories", async () => {

    await Category.create({
      name: "AI"
    });

    const res = await request(app)
      .get("/api/categories");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);

  });

});
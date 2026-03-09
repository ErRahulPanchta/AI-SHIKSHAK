import request from "supertest";
import app from "../../src/app.js";
import Category from "../../src/modules/category/category.model.js";
import { jest } from "@jest/globals";


jest.setTimeout(20000);
describe("Get Category By Slug", () => {

  it("should fetch category", async () => {

    const category = await Category.create({
      name: "Machine Learning"
    });

    const res = await request(app)
      .get(`/api/categories/${category.slug}`);

    expect(res.statusCode).toBe(200);

  });

});
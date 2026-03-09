import request from "supertest";
import app from "../../src/app.js";
import { createUserAndToken } from "../blog/testUtils.js";
import Category from "../../src/modules/category/category.model.js";
import { jest } from "@jest/globals";


jest.setTimeout(20000);
describe("Update Category", () => {

  it("admin should update category", async () => {

    const { token } = await createUserAndToken("admin");

    const category = await Category.create({
      name: "AI"
    });

    const res = await request(app)
      .patch(`/api/categories/${category._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Artificial Intelligence" });

    expect(res.statusCode).toBe(200);

  });

});
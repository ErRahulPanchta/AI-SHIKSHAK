import request from "supertest";
import app from "../../src/app.js";
import { createUserAndToken } from "../blog/testUtils.js";
import Category from "../../src/modules/category/category.model.js";

describe("Delete Category", () => {

  it("admin should delete category", async () => {

    const { token } = await createUserAndToken("admin");

    const category = await Category.create({
      name: "AI"
    });

    const res = await request(app)
      .delete(`/api/categories/${category._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

  });

});
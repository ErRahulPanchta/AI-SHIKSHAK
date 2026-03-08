import request from "supertest";
import app from "../../src/app.js";
import Category from "../../src/modules/category/category.model.js";

describe("Get Child Categories", () => {

  it("should return child categories", async () => {

    const parent = await Category.create({
      name: "Artificial Intelligence"
    });

    await Category.create({
      name: "Machine Learning",
      parent: parent._id
    });

    const res = await request(app)
      .get(`/api/categories/${parent._id}/children`);

    expect(res.statusCode).toBe(200);

  });

});
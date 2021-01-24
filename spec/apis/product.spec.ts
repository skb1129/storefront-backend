import supertest from "supertest";

import app from "../../src/app";

import { getAuth } from "../helpers/getAuth";

describe("Product API Tests", () => {
  beforeAll(async () => {
    auth = await getAuth(request);
  });

  let auth: [string, string];
  const request = supertest(app);
  const product = { id: undefined, name: "test", price: 20 };

  it("should create new product", async () => {
    const res = await request
      .post("/product/")
      .set(...auth)
      .send(product);
    expect(res.status).toBe(200);
    expect(res.body.id).toBeTruthy();
    product.id = res.body.id;
  });

  it("should get list of products", async () => {
    const res = await request.get("/product/all/");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  });

  it("should get product info", async () => {
    const res = await request.get(`/product/${product.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(product.id);
  });

  it("should update product info", async () => {
    product.name = "new name";
    product.price = 100;
    const res = await request
      .put("/product/")
      .set(...auth)
      .send(product);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(product);
  });

  it("should delete product", async () => {
    const res = await request.delete(`/product/${product.id}`).set(...auth);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(product);
  });
});

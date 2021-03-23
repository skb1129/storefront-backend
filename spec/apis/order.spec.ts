import supertest from "supertest";

import app from "../../src/app";

import { getAuth } from "../helpers/getAuth";

describe("User API Tests", () => {
  beforeAll(async () => {
    auth = await getAuth(request);
  });

  let auth: [string, string];
  const request = supertest(app);
  const order = {
    id: undefined,
    status: "active",
    products: [
      { product_id: 1, quantity: 20 },
      { product_id: 2, quantity: 10 },
    ],
    user_id: "root",
  };

  it("should create new order", async () => {
    const res = await request
      .post("/order/")
      .set(...auth)
      .send(order);
    expect(res.status).toBe(200);
    expect(res.body.id).toBeTruthy();
    order.id = res.body.id;
  });

  it("should get list of orders", async () => {
    const res = await request.get("/order/all/").set(...auth);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  });

  it("should get order info", async () => {
    const res = await request.get(`/order/${order.id}`).set(...auth);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(order.id);
    expect(res.body.user_id).toBe(order.user_id);
    expect(res.body.status).toBe(order.status);
    expect(res.body.products.length).toBe(order.products.length);
    order.products = res.body.products;
  });

  it("should get list of orders by user_id", async () => {
    const res = await request.get(`/order/user/${order.user_id}`).set(...auth);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  });

  it("should get list of self orders", async () => {
    const res = await request.get("/order/").set(...auth);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  });

  it("should update order info", async () => {
    order.status = "completed";
    const res = await request
      .put("/order/")
      .set(...auth)
      .send(order);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(order);
  });

  it("should delete order", async () => {
    const res = await request.delete(`/order/${order.id}`).set(...auth);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(order);
  });
});

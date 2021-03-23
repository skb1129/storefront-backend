import { Order } from "../../src/models";

describe("Order DB model tests", () => {
  const values = {
    id: 0,
    status: "active",
    products: [
      { product_id: 1, quantity: 20 },
      { product_id: 2, quantity: 10 },
    ],
    user_id: "root",
  };

  it("should create new order", async () => {
    const order = new Order(values.status, values.products, values.user_id);
    await order.create();
    expect(order.id).toBeTruthy();
    values.id = order.id || 0;
  });

  it("should return all orders", async () => {
    const orders = await Order.getAll();
    expect(orders?.length).toBeGreaterThan(0);
  });

  it("should return order", async () => {
    const order = await Order.getById(values.id);
    expect(order).toBeInstanceOf(Order);
    const orderObj = order?.getObject();
    expect(orderObj?.id).toEqual(values.id);
    expect(orderObj?.user_id).toEqual(values.user_id);
    expect(orderObj?.status).toEqual(values.status);
    expect(orderObj?.products.length).toEqual(values.products.length);
  });

  it("should return order by user_id", async () => {
    const orders = await Order.getByUserId(values.user_id);
    expect(orders?.length).toBeGreaterThan(0);
  });

  it("should update order", async () => {
    const order = await Order.getById(values.id);
    if (!order) return;
    order.status = "completed";
    await order.update();
    expect(order.status).toBe("completed");
    values.status = order.status;
  });

  it("should delete order", async () => {
    let order = await Order.getById(values.id);
    if (!order) return;
    await order.delete();
    order = await Order.getById(values.id);
    expect(order).toBeFalsy();
  });
});

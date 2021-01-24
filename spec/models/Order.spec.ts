import { Order } from "../../src/models";

describe("Order DB model tests", () => {
  const values = { id: 0, status: "active", products: [1,2], quantities: [20, 30], user_id: "stark" };

  it("should create new order", async () => {
    const order = new Order(values.status, values.products, values.quantities, values.user_id);
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
    expect(order?.getObject()).toEqual(values);
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

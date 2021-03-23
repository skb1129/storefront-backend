import format from "pg-format";

import { client } from "../database";
import { OrderProduct } from "../types";

export class Order {
  id?: number;
  status: string;
  products: OrderProduct[];
  user_id: string;
  constructor(status: string, products: OrderProduct[], user_id: string, id?: number) {
    this.status = status;
    this.products = products;
    this.user_id = user_id;
    this.id = id;
  }

  getObject() {
    return {
      id: this.id,
      status: this.status,
      products: this.products,
      user_id: this.user_id,
    };
  }

  static async getAll() {
    try {
      const { rows } = await client.query(
        "SELECT o.*, array_agg(row_to_json(op)) as products FROM orders o JOIN order_products op ON o.id = op.order_id GROUP BY o.id"
      );
      return rows.map((row) => new Order(row.status, row.products, row.user_id, row.id));
    } catch (e) {
      console.log("Error fetching all orders", e);
    }
  }

  static async getById(id: number) {
    const query = {
      text:
        "SELECT o.*, array_agg(row_to_json(op)) as products FROM orders o JOIN order_products op ON o.id = op.order_id WHERE o.id = $1 GROUP BY o.id",
      values: [id],
    };
    try {
      const { rows } = await client.query(query);
      if (!rows.length) return null;
      return new Order(rows[0].status, rows[0].products, rows[0].user_id, rows[0].id);
    } catch (e) {
      console.log(`Error fetching order with id: ${id}`, e);
    }
  }

  static async getByUserId(user_id: string) {
    const query = {
      text:
        "SELECT o.*, array_agg(row_to_json(op)) as products FROM orders o JOIN order_products op ON o.id = op.order_id WHERE o.user_id = $1 GROUP BY o.id",
      values: [user_id],
    };
    try {
      const { rows } = await client.query(query);
      return rows.map((row) => new Order(row.status, row.products, row.user_id, row.id));
    } catch (e) {
      console.log(`Error fetching orders with user_id: ${user_id}`, e);
    }
  }

  async create() {
    const query = {
      text: "INSERT INTO orders(status, user_id) VALUES($1, $2) RETURNING id",
      values: [this.status, this.user_id],
    };
    try {
      const { rows } = await client.query(query);
      this.id = rows[0].id;
      const products = this.products.map((product) => [this.id, product.product_id, product.quantity]);
      await client.query(format("INSERT INTO order_products(order_id, product_id, quantity) VALUES %L", products));
    } catch (e) {
      console.log("Error creating new order", e);
    }
  }

  async update() {
    if (!this.id) return;
    const query = {
      text: "UPDATE orders SET status = $1, user_id = $2 WHERE id = $3",
      values: [this.status, this.user_id, this.id],
    };
    try {
      await client.query(query);
    } catch (e) {
      console.log(`Error update order with id: ${this.id}`, e);
    }
  }

  async delete() {
    if (!this.id) return;
    const query1 = { text: "DELETE FROM order_products WHERE order_id = $1", values: [this.id] };
    const query2 = { text: "DELETE FROM orders WHERE id = $1", values: [this.id] };
    try {
      await client.query(query1);
      await client.query(query2);
    } catch (e) {
      console.log(`Error deleting order with id: ${this.id}`, e);
    }
  }
}

import { client } from "../database";

export class Order {
  id?: number;
  status: string;
  products: number[];
  quantities: number[];
  user_id: string;
  constructor(status: string, products: number[], quantities: number[], user_id: string, id?: number) {
    this.status = status;
    this.products = products;
    this.quantities = quantities;
    this.user_id = user_id;
    this.id = id;
  }

  getObject() {
    return {
      id: this.id,
      status: this.status,
      products: this.products,
      quantities: this.quantities,
      user_id: this.user_id,
    };
  }

  static async getAll() {
    try {
      const { rows } = await client.query("SELECT * FROM orders");
      return rows.map((row) => {
        return new Order(row.status, JSON.parse(row.products), JSON.parse(row.quantities), row.user_id, row.id);
      });
    } catch (e) {
      console.log("Error fetching all orders", e);
    }
  }

  static async getById(id: number) {
    const query = {
      text: "SELECT * FROM orders WHERE id = $1",
      values: [id],
    };
    try {
      const { rows } = await client.query(query);
      if (!rows.length) return null;
      return new Order(
        rows[0].status,
        JSON.parse(rows[0].products),
        JSON.parse(rows[0].quantities),
        rows[0].user_id,
        rows[0].id
      );
    } catch (e) {
      console.log(`Error fetching order with id: ${id}`, e);
    }
  }

  static async getByUserId(user_id: string) {
    const query = {
      text: "SELECT * FROM orders WHERE user_id = $1",
      values: [user_id],
    };
    try {
      const { rows } = await client.query(query);
      return rows.map((row) => {
        return new Order(row.status, JSON.parse(row.products), JSON.parse(row.quantities), row.user_id, row.id);
      });
    } catch (e) {
      console.log(`Error fetching orders with user_id: ${user_id}`, e);
    }
  }

  async create() {
    const query = {
      text: "INSERT INTO orders(status, products, quantities, user_id) VALUES($1, $2, $3, $4) RETURNING id",
      values: [this.status, JSON.stringify(this.products), JSON.stringify(this.quantities), this.user_id],
    };
    try {
      const { rows } = await client.query(query);
      this.id = rows[0].id;
    } catch (e) {
      console.log("Error creating new order", e);
    }
  }
}

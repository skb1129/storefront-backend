import { client } from "../database";

export class Product {
  id?: number;
  name: string;
  price: number;
  constructor(name: string, price: number, id?: number) {
    this.name = name;
    this.price = price;
    this.id = id;
  }

  getObject() {
    return { id: this.id, name: this.name, price: this.price };
  }

  static async getAll() {
    try {
      const { rows } = await client.query("SELECT * FROM products");
      return rows.map((row) => new Product(row.name, row.price, row.id));
    } catch (e) {
      console.log("Error fetching all products", e);
    }
  }

  static async getById(id: number) {
    const query = { text: "SELECT * FROM products WHERE id = $1", values: [id] };
    try {
      const { rows } = await client.query(query);
      if (!rows.length) return null;
      return new Product(rows[0].name, rows[0].price, rows[0].id);
    } catch (e) {
      console.log(`Error fetching product with id: ${id}`, e);
    }
  }

  async create() {
    const query = {
      text: "INSERT INTO products(name, price) VALUES($1, $2) RETURNING id",
      values: [this.name, this.price],
    };
    try {
      const { rows } = await client.query(query);
      this.id = rows[0].id;
    } catch (e) {
      console.log("Error creating new product", e);
    }
  }

  async update() {
    if (!this.id) return;
    const query = {
      text: "UPDATE products SET name = $1, price = $2 WHERE id = $3",
      values: [this.name, this.price, this.id],
    };
    try {
      await client.query(query);
    } catch (e) {
      console.log(`Error updating product with id: ${this.id}`, e);
    }
  }

  async delete() {
    if (!this.id) return;
    const query = { text: "DELETE FROM products WHERE id = $1", values: [this.id] };
    try {
      await client.query(query);
    } catch (e) {
      console.log(`Error deleting product with id: ${this.id}`, e);
    }
  }
}

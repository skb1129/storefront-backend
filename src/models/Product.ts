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
    const query = {
      text: "SELECT * FROM products WHERE id = $1",
      values: [id],
    };
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
}

import bcrypt from "bcrypt";

import { SALT_ROUNDS } from "../configs";
import { client } from "../database";

export class User {
  static async getAll() {
    try {
      const { rows } = await client.query("SELECT * FROM users");
      const users = rows.map(
        (row) => new User(row.id, row.firstname, row.lastname, row.password)
      );
      return users;
    } catch (e) {
      console.log("Error fetching all users", e);
    }
  }
  static async getById(id: string) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    };
    try {
      const { rows } = await client.query(query);
      if (!rows.length) return null;
      return new User(
        rows[0].id,
        rows[0].firstname,
        rows[0].lastname,
        rows[0].password
      );
    } catch (e) {
      console.log(`Error fetching user with id: ${id}`, e);
    }
  }

  id: string;
  firstname: string;
  lastname: string;
  password: string;
  constructor(
    id: string,
    firstname: string,
    lastname: string,
    password: string
  ) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password;
  }

  getObject() {
    return { id: this.id, firstname: this.firstname, lastname: this.lastname };
  }

  async create() {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    const query = {
      text:
        "INSERT INTO users(id, firstname, lastname, password) VALUES($1, $2, $3, $4)",
      values: [this.id, this.firstname, this.lastname, this.password],
    };
    try {
      await client.query(query);
    } catch (e) {
      console.log("Error creating new user", e);
    }
  }
}

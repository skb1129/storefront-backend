import bcrypt from "bcrypt";

import { SALT_ROUNDS } from "../configs";
import { client } from "../database";

export class User {
  static async getAll() {
    try {
      const { rows } = await client.query("SELECT * FROM users");
      const users = rows.map(
        (row) => new User(row.id, row.firstname, row.lastname, row.password, row.superuser)
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
        rows[0].password,
        rows[0].superuser,
      );
    } catch (e) {
      console.log(`Error fetching user with id: ${id}`, e);
    }
  }

  id: string;
  firstname: string;
  lastname: string;
  password: string;
  superuser: boolean;
  constructor(
    id: string,
    firstname: string,
    lastname: string,
    password: string,
    superuser: boolean = false
  ) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password;
    this.superuser = superuser;
  }

  getObject() {
    return { id: this.id, firstname: this.firstname, lastname: this.lastname, superuser: this.superuser };
  }

  async create() {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    const query = {
      text:
        "INSERT INTO users(id, firstname, lastname, password, superuser) VALUES($1, $2, $3, $4, $5)",
      values: [
        this.id,
        this.firstname,
        this.lastname,
        this.password,
        this.superuser,
      ],
    };
    try {
      await client.query(query);
    } catch (e) {
      console.log("Error creating new user", e);
    }
  }
}

import { Client } from "pg";

import { User } from "../models";

export const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function createRootUser() {
  const password = process.env.ROOT_USER_PASSWORD || "password";
  try {
    const rootUser = await User.getById("root");
    if (rootUser) return;
    const user = new User("root", "Root", "Root", password, true);
    await user.create();
  } catch (e) {
    console.log("Error creating the root user:", e);
  }
}

export async function connect() {
  try {
    await client.connect();
    await createRootUser();
  } catch (e) {
    console.log("Error starting connecting to PG database:", e);
  }
}

export async function disconnect() {
  try {
    await client.end();
  } catch (e) {
    console.log("Error terminating connection to PG database:", e);
  }
}

import { Client } from "pg";

export const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

export async function connect() {
  try {
    await client.connect();
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

import jwt from "jsonwebtoken";

import { TokenData } from "../types";

const JWT_SECRET = `${process.env.JWT_SECRET}`;

export function generate(data: TokenData) {
  return jwt.sign(data, JWT_SECRET);
}

export function verify(token: string) {
  try {
    const data = jwt.verify(token, JWT_SECRET);
    return data;
  } catch (e) {
    console.log("Error verifying JWT token", e);
  }
}
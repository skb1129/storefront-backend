import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../configs";
import { TokenData } from "../types";

export function generate(data: TokenData, expiresIn?: string | number) {
  return jwt.sign(data, JWT_SECRET, { expiresIn });
}

export function verify(token: string): TokenData | undefined {
  try {
    const data = jwt.verify(token, JWT_SECRET);
    return data as TokenData;
  } catch (e) {
    console.log("Error verifying JWT token", e);
  }
}

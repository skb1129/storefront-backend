import bcrypt from "bcrypt";
import { Router } from "express";

import { TOKEN_EXPIRATION } from "../configs";
import { User } from "../models";
import { token } from "../utils";

const api = Router();

api.post("/login/", async (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) return res.status(400).send();
  const user = await User.getById(id);
  if (!user) return res.status(404).send(`No user found with id: ${id}`);
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).send("Password mismatch");
  res.send(token.generate({ sub: id, admin: user.superuser }, TOKEN_EXPIRATION));
});

export { api };

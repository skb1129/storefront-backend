import { Router } from "express";

import { User } from "../models";

const api = Router();

api.get("/all/", async (req, res) => {
  const users = await User.getAll();
  res.send(users?.map((user) => user.getObject()));
});

api.get("/:id/", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send();
  const user = await User.getById(id);
  res.send(user?.getObject() || `No user found with id: ${id}`);
});

api.post("/", async (req, res) => {
  const { id, firstname, lastname, password } = req.body;
  if (!id || !firstname || !lastname || !password)
    return res.status(400).send();
  const user = new User(id, firstname, lastname, password);
  await user.create();
  res.send(user.getObject());
});

export { api };

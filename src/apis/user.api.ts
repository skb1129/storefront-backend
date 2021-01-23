import { Router } from "express";

import { User } from "../models";
import { auth } from "../utils";

const api = Router();

api.get(
  "/all/",
  auth.requiresAuth(async (req, res) => {
    const users = await User.getAll();
    res.send(users?.map((user) => user.getObject()));
  })
);

api.get(
  "/:id/",
  auth.requiresAuth(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).send();
    const user = await User.getById(id);
    res.send(user?.getObject() || `No user found with id: ${id}`);
  })
);

api.post(
  "/",
  auth.requiresAuth(async (req, res, auth) => {
    if (!auth.admin) res.status(401).send();
    const { id, firstname, lastname, password, superuser } = req.body;
    if (!id || !firstname || !lastname || !password) return res.status(400).send();
    const user = new User(id, firstname, lastname, password, superuser);
    await user.create();
    res.send(user.getObject());
  })
);

export { api };

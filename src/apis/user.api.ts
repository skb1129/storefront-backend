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
    if (!user) res.status(204);
    res.send(user?.getObject() || `No user found with id: ${id}`);
  })
);

api.post(
  "/",
  auth.requiresAuth(async (req, res, auth) => {
    if (!auth.admin) return res.status(401).send();
    const { id, firstname, lastname, password, superuser } = req.body;
    if (!id || !firstname || !lastname || !password) return res.status(400).send();
    const user = new User(id, firstname, lastname, password, superuser);
    await user.create();
    res.send(user.getObject());
  })
);

api.put(
  "/",
  auth.requiresAuth(async (req, res, auth) => {
    const { id, firstname, lastname, password, superuser } = req.body;
    if (!id) return res.status(400).send();
    if (id !== auth.sub && !auth.admin) return res.status(401).send();
    const user = await User.getById(id);
    if (!user) return res.status(204).send(`No user found with id: ${id}`);
    firstname && (user.firstname = firstname);
    lastname && (user.lastname = lastname);
    password && (user.password = password);
    typeof superuser === "boolean" && (user.superuser = superuser);
    await user.update(!!password);
    res.send(user.getObject());
  })
);

api.delete(
  "/:id/",
  auth.requiresAuth(async (req, res, auth) => {
    if (!auth.admin) return res.status(401).send();
    const { id } = req.params;
    if (!id) return res.status(400).send();
    const user = await User.getById(id);
    if (!user) return res.status(204).send(`No user found with id: ${id}`);
    await user.delete();
    res.send(user.getObject());
  })
);

export { api };

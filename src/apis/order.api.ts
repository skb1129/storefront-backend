import { Router } from "express";

import { Order } from "../models";
import { auth } from "../utils";

const api = Router();

api.get(
  "/all/",
  auth.requiresAuth(async (req, res, auth) => {
    if (!auth.admin) return res.status(401).send();
    const orders = await Order.getAll();
    res.send(orders?.map((order) => order.getObject()));
  })
);

api.get(
  "/:id/",
  auth.requiresAuth(async (req, res, auth) => {
    if (!auth.admin) return res.status(401).send();
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).send();
    const order = await Order.getById(id);
    if (!order) res.status(204);
    res.send(order?.getObject() || `No order found with id: ${id}`);
  })
);

api.get(
  "/user/:user_id/",
  auth.requiresAuth(async (req, res, auth) => {
    if (!auth.admin) return res.status(401).send();
    const { user_id } = req.params;
    if (!user_id) return res.status(400).send();
    const orders = await Order.getByUserId(user_id);
    res.send(orders?.map((order) => order.getObject()));
  })
);

api.get(
  "/",
  auth.requiresAuth(async (req, res, auth) => {
    const orders = await Order.getByUserId(auth.sub);
    res.send(orders?.map((order) => order.getObject()));
  })
);

api.post(
  "/",
  auth.requiresAuth(async (req, res, auth) => {
    const { status, products, quantities, user_id } = req.body;
    if (!status || !user_id || !products?.length || !quantities?.length || products.length !== quantities.length)
      return res.status(400).send();
    if (user_id !== auth.sub && !auth.admin) return res.status(401).send();
    const order = new Order(status, products, quantities, user_id);
    await order.create();
    res.send(order.getObject());
  })
);

api.put(
  "/",
  auth.requiresAuth(async (req, res, auth) => {
    if (!auth.admin) return res.status(401).send();
    const { id, status, products, quantities, user_id } = req.body;
    if (!id) return res.status(400).send();
    const order = await Order.getById(id);
    if (!order) return res.status(204).send(`No order found with id: ${id}`);
    status && (order.status = status);
    user_id && (order.user_id = user_id);
    if (products?.length && quantities?.length && products.length == quantities.length) {
      order.products = products;
      order.quantities = quantities;
    }
    await order.update();
    res.send(order.getObject());
  })
);

api.delete(
  "/:id/",
  auth.requiresAuth(async (req, res, auth) => {
    if (!auth.admin) return res.status(401).send();
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).send();
    const order = await Order.getById(id);
    if (!order) return res.status(204).send(`No order found with id: ${id}`);
    await order.delete();
    res.send(order.getObject());
  })
);

export { api };

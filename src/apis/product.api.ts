import { Router } from "express";

import { Product } from "../models";
import { auth } from "../utils";

const api = Router();

api.get("/all/", async (req, res) => {
  const products = await Product.getAll();
  res.send(products?.map((product) => product.getObject()));
});

api.get("/:id/", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).send();
  const product = await Product.getById(id);
  if (!product) res.status(204);
  res.send(product?.getObject() || `No product found with id: ${id}`);
});

api.post(
  "/",
  auth.requiresAuth(async (req, res) => {
    let { name, price } = req.body;
    price = Number(price);
    if (!name || Number.isNaN(price)) return res.status(400).send();
    const product = new Product(name, price);
    await product.create();
    res.send(product.getObject());
  })
);

api.put(
  "/:id/",
  auth.requiresAuth(async (req, res) => {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) return res.status(400).send();
    const product = await Product.getById(id);
    if (!product) return res.status(204).send(`No product found with id: ${id}`);
    let { name, price } = req.body;
    price = Number(price);
    name && (product.name = name);
    !Number.isNaN(price) && (product.price = price);
    await product.update();
    res.send(product.getObject());
  })
);

api.delete(
  "/:id/",
  auth.requiresAuth(async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).send();
    const product = await Product.getById(id);
    if (!product) return res.status(204).send(`No product found with id: ${id}`);
    await product.delete();
    res.send(product.getObject());
  })
);

export { api };

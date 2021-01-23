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
  res.send(product?.getObject() || `No product found with id: ${id}`);
});

api.post("/", auth.requiresAuth(async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).send();
  const product = new Product(name, price);
  await product.create();
  res.send(product.getObject());
}));

export { api };

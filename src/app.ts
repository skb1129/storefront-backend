import express from "express";
import bodyParser from "body-parser";

import { product } from "./apis";

const app = express();

app.use(bodyParser.json());

app.use("/product", product);

export default app;

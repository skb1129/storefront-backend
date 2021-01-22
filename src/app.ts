import express from "express";
import bodyParser from "body-parser";

import { product, user } from "./apis";

const app = express();

app.use(bodyParser.json());

app.use("/product", product);
app.use("/user", user);

export default app;

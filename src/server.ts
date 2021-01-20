// Initially parse and load environment file
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connect } from "./database";

connect();

const PORT = 8000;

app.listen(PORT, function () {
  console.log(`starting app on port: ${PORT}`);
});

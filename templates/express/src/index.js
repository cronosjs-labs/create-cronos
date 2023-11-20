import dotenv from "dotenv";

import express from "express";

import defaultRoute from "./routes/default.routes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 5050;

app.use("/", defaultRoute);

app.listen(port, () => {
  console.log(`🚀  \x1b[1mServer running on port \x1b[33m${port}\x1b[0m`);
});

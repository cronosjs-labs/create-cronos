import { Express, Request, Response } from "express";

import dotenv from "dotenv";

import express from "express";

dotenv.config();

const app: Express = express();

const port = process.env.PORT || 5050;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + Cronos");
});

app.listen(port, () => {
  console.log(`🚀  \x1b[1mServer running on port \x1b[33m${port}\x1b[0m`);
});

import express from "express";
import { PORT, NODE_ENV } from "./config/env.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, Welcome to paybay API!");
});

app.listen(PORT, () => {
  console.log(`paybay API is running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});

export default app;

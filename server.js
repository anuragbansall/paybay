import express from "express";
import { PORT, NODE_ENV } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, Welcome to paybay API!");
});

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`paybay API is running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});

export default app;

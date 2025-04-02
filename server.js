import express from "express";
import { PORT, NODE_ENV } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectDB from "./database/mongodb.js";

const app = express();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.get("/", (req, res) => {
  res.send("Hello, Welcome to paybay API!");
});

app.listen(PORT, async () => {
  console.log(`paybay API is running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  await connectDB();
});

export default app;

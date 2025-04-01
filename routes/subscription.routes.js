import { Router } from "express";
import {
  cancelSubscription,
  createSubscription,
  deleteSubscription,
  getAllUpcomingRenewal,
  getAllUpcomingRenewalByUserId,
  getSubscriptionById,
  getSubscriptions,
  getSubscriptionsByUserId,
  updateSubscription,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/upcoming-renewal", getAllUpcomingRenewal);

subscriptionRouter.get(
  "/upcoming-renewal/:userId",
  getAllUpcomingRenewalByUserId
);

subscriptionRouter.get("/", getSubscriptions);

subscriptionRouter.get("/:id", getSubscriptionById);

subscriptionRouter.post("/", createSubscription);

subscriptionRouter.put("/:id", updateSubscription);

subscriptionRouter.delete("/:id", deleteSubscription);

subscriptionRouter.get("/user/:userId", getSubscriptionsByUserId);

subscriptionRouter.put("/:id/cancel", cancelSubscription);

export default subscriptionRouter;

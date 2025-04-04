import { SERVER_URL } from "../config/env.js";
import { workFlowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";

export const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({});
    res.status(200).json({
      status: "success",
      message: "Subscriptions retrieved successfully",
      data: subscriptions,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getSubscriptionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      message: `Subscription with ID ${id} retrieved successfully`,
      data: subscription,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    if (!subscription) {
      const error = new Error("Failed to create subscription");
      error.status = 400;
      throw error;
    }

    const { workflowRunId } = await workFlowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription._id,
      },
      headers: {
        "Content-Type": "application/json",
      },
      retries: 3,
    });

    res.status(201).json({
      status: "success",
      message: "Subscription created successfully",
      data: { subscription, workflowRunId },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      message: `Subscription with ID ${id} updated successfully`,
      data: subscription,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByIdAndDelete(id);

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      message: `Subscription with ID ${id} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getSubscriptionsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const subscriptions = await Subscription.find({ user: userId });

    if (!subscriptions) {
      const error = new Error("No subscriptions found for this user");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      message: `Subscriptions for user with ID ${userId} retrieved successfully`,
      data: subscriptions,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { status: "inactive" },
      { new: true, runValidators: true }
    );

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      message: `Subscription with ID ${id} cancelled successfully`,
      data: subscription,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllUpcomingRenewal = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({
      renewalDate: { $gt: new Date() },
    });

    if (!subscriptions) {
      const error = new Error("No upcoming renewals found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      message: "Upcoming renewals retrieved successfully",
      data: subscriptions,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllUpcomingRenewalByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const subscriptions = await Subscription.find({
      user: userId,
      renewalDate: { $gt: new Date() },
    });

    if (!subscriptions) {
      const error = new Error("No upcoming renewals found for this user");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      message: `Upcoming renewals for user with ID ${userId} retrieved successfully`,
      data: subscriptions,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

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

    res.status(201).json({
      status: "success",
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  const { id } = req.params;
  res.status(200).json({
    status: "success",
    message: `Subscription with ID ${id} updated successfully`,
  });
};

export const deleteSubscription = async (req, res, next) => {
  const { id } = req.params;
  res.status(200).json({
    status: "success",
    message: `Subscription with ID ${id} deleted successfully`,
  });
};

export const getSubscriptionsByUserId = async (req, res, next) => {
  const { userId } = req.params;
  res.status(200).json({
    status: "success",
    message: `Subscriptions for user with ID ${userId} retrieved successfully`,
  });
};

export const cancelSubscription = async (req, res, next) => {
  const { id } = req.params;
  res.status(200).json({
    status: "success",
    message: `Subscription with ID ${id} cancelled successfully`,
  });
};

export const getAllUpcomingRenewal = async (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "Upcoming renewals retrieved successfully",
  });
};

export const getAllUpcomingRenewalByUserId = async (req, res, next) => {
  const { userId } = req.params;
  res.status(200).json({
    status: "success",
    message: `Upcoming renewals for user with ID ${userId} retrieved successfully`,
  });
};

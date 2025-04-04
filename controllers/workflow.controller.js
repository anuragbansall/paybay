import { createRequire } from "module";
import Subscription from "../models/subscription.model.js";
const require = createRequire(import.meta.url);
import dayjs from "dayjs";
const { serve } = require("@upstash/workflow/express");

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") {
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    context.log(`Renewal date has passed for subscription ${subscriptionId}`);
    return;
  }

  for (const days of REMINDERS) {
    const reminderDate = renewalDate.subtract(days, "day");

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `Reminder ${days} days before`,
        reminderDate
      );
    }
    await triggerReminder(context, `Reminder ${days} days before`);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return await Subscription.findById(subscriptionId).populate(
      "user",
      "name email"
    );
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {
  return await context.run(label, () => {
    console.log(`Triggering reminder: ${label}`);
    // Send email, SMS, or any other notification here
  });
};

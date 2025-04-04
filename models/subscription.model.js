import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must be at most 50 characters long"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      enum: ["INR", "USD", "EUR", "GBP"],
      default: "INR",
    },
    frequency: {
      type: String,
      required: [true, "Frequency is required"],
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["basic", "premium", "enterprise"],
      default: "basic",
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["credit_card", "debit_card", "paypal"],
      default: "credit_card",
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["active", "inactive"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      default: Date.now,
      validate: {
        validator: function (value) {
          return value <= Date.now();
        },
        message: "Start date must be in the past or present",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: "Renewal date must be after start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
  },
  { timestamps: true }
);

// Pre-save the renewal date if not provided
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: { type: "date", value: 1 },
      weekly: { type: "date", value: 7 },
      monthly: { type: "month", value: 1 },
      yearly: { type: "year", value: 1 },
    };

    const renewalPeriod = renewalPeriods[this.frequency];
    this.renewalDate = new Date(this.startDate);

    if (renewalPeriod.type === "date") {
      this.renewalDate.setDate(
        this.renewalDate.getDate() + renewalPeriod.value
      );
    } else if (renewalPeriod.type === "month") {
      this.renewalDate.setMonth(
        this.renewalDate.getMonth() + renewalPeriod.value
      );
    } else if (renewalPeriod.type === "year") {
      this.renewalDate.setFullYear(
        this.renewalDate.getFullYear() + renewalPeriod.value
      );
    }
  }

  if (this.renewalDate < this.startDate) {
    this.status = "inactive";
  }

  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;

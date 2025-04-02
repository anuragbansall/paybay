import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { genToken } from "../utils/genToken.js";

export const signup = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const error = new Error("All fields are required!");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists!");
      error.statusCode = 409;
      throw error;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save({ session });

    // Generate a token
    const token = genToken(newUser._id);

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: {
        user: newUser,
        token,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error("All fields are required!");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid credentials!");
      error.statusCode = 401;
      throw error;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid credentials!");
      error.statusCode = 401;
      throw error;
    }

    // Generate a token
    const token = genToken(user._id);

    return res.status(200).json({
      success: true,
      message: "User signed in successfully!",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Error during signin:", error);
    next(error);
  }
};

export const signout = async (req, res) => {
  // Todo: Implement signout logic
  res.status(200).json({ message: "User signed out successfully!" });
};

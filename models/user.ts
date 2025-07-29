import { IUser } from "@/types";
import mongoose from "mongoose";

const UserSchema: mongoose.Schema<IUser> = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide a name"],
    },
    auth: {
      email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please provide a valid email",
        ],
        trim: true,
      },
      password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        select: false,
      },
      transactionPin: {
        type: String,
        select: false,
        min: [4, "Transaction pin must be at least 4 characters"],
        max: [4, "Transaction pin must be at most 4 characters"],
      },
    },
    canUserMakeTransaction: {
      default: true,
      type: Boolean,
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide a phone number"],
      unique: true,
      trim: true,
    },
    country: {
      type: String,
      enum: ["nigeria"],
      lowercase: true,
      default: "nigeria",
    },
    balance: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    hasSetPin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    refCode: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const User: mongoose.Model<IUser> =
  mongoose.models.User || mongoose.model("User", UserSchema);

export { User };

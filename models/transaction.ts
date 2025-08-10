import type { transaction } from "@/types";
import mongoose from "mongoose";

const TransactionSchema: mongoose.Schema<transaction> = new mongoose.Schema(
  {
    amount: {
      type: Number, // Changed from String to Number to match the actual data type
      required: true,
      min: 0,
      validate: {
        validator(amount: number) {
          return !isNaN(amount);
        },
        message: "Amount must be a number",
      },
    },
    note: {
      type: String,
      maxlength: 256,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["virtualAccount", "dedicatedAccount", "ownAccount"],
      default: "virtualAccount",
    },
    tx_ref: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["funding", "airtime", "bill", "data", "exam", "recharge-card"],
      default: "funding",
    },
    user: {
      type: String,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true, // Added timestamps for better tracking
  }
);

const Transaction: mongoose.Model<transaction> =
  mongoose.models.Transaction ||
  mongoose.model<transaction>("Transaction", TransactionSchema);

export { Transaction };

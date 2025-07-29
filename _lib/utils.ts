import { Account } from "@/models/account";
import {
  availableBanks as availableBanksTypes,
  createDedicatedAccountProps,
  createDedicatedVirtualAccountResponse,
  IUser,
} from "@/types";
import axios from "axios";
import { createTransport } from "nodemailer";
import mongoose from "mongoose";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const availableBanks: availableBanksTypes[] = [
  "PALMPAY",
  "9PSB",
  "BANKLY",
  "PROVIDUS",
  "SAFEHAVEN",
];

export const processAccountNumberForUser = async (user: IUser) => {
  let trial = 0;
  let errorMessage = "";
  let isAccountCreated = false;

  try {
    const [firstName, lastName] = user.fullName.split(" ");

    while (trial < availableBanks.length) {
      const bank = availableBanks[trial];

      const payload: createDedicatedAccountProps = {
        bank,
        email: user.auth.email,
        firstName,
        lastName: lastName || firstName,
        phone: user.phoneNumber,
        reference: user?._id?.toString()!,
      };

      const response = await axios.post<createDedicatedVirtualAccountResponse>(
        `https://api.billstack.co/v2/thirdparty/generateVirtualAccount/`,
        { ...payload, reference: payload.reference.toString() },
        {
          headers: {
            Authorization: `Bearer ${process.env.BILL_STACK_SECRET_KEY}`,
          },
        }
      );

      //The response was not what we want
      if (!response.data.status) {
        errorMessage = response.data.message;
        trial++;
        continue;
      }

      const { account, reference } = response.data.data;

      const dedicatedUserAccount = new Account({
        accountDetails: {
          accountName: account[0]?.account_name,
          accountNumber: account[0]?.account_number,
          accountRef: reference,
          bankCode: account[0]?.bank_id,
          bankName: account[0]?.bank_name,
        },
        hasDedicatedAccountNumber: true,
        order_ref: user._id,
        user: user._id,
      });

      await dedicatedUserAccount.save({ validateBeforeSave: true });

      isAccountCreated = true;

      break;
    }
  } catch (error: any) {
    trial++;
    errorMessage = error?.response?.data?.message || error?.message;
  }

  return {
    errorMessage,
    isAccountCreated,
  };
};

// Track the connection state
let isConnected = false;

export const connectToDatabase = async () => {
  const MONGO_DB_URI = process.env.MONGO_DB_URI!;

  // If already connected, return the existing connection
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    // Set strictQuery to prepare for Mongoose 7
    mongoose.set("strictQuery", false);

    // Configure connection options
    const options = {
      bufferCommands: true, // Allow buffering commands until connection is established
      autoIndex: true, // Build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    // Connect to MongoDB
    const connection = await mongoose.connect(MONGO_DB_URI, options);

    // Set connection flag
    isConnected = !!connection.connections[0].readyState;

    console.log("Connected to MongoDB");
    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to database");
  }
};

export async function sendEmail(
  recipients: string[],
  emailTemplate: string,
  subject: string,
  replyTo?: string
) {
  let configOptions: SMTPTransport | SMTPTransport.Options | string = {
    host: "smtp-relay.brevo.com",
    port: 587,
    ignoreTLS: true,
    auth: {
      user: process.env.HOST_EMAIL,
      pass: process.env.HOST_EMAIL_PASSWORD,
    },
  };

  const transporter = createTransport(configOptions);
  await transporter.sendMail({
    from: "kinta@data.com",
    to: recipients,
    html: emailTemplate,
    replyTo,
    subject: subject,
  });
}

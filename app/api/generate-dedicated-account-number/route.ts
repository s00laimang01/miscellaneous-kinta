import {
  connectToDatabase,
  processAccountNumberForUser,
  sendEmail,
} from "@/_lib/utils";
import { Account } from "@/models/account";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, signature } = await request.json();

    if (signature !== process.env.SIGNATURE) {
      return NextResponse.json({
        status: "error",
        message: "Invalid signature",
        error: "Signature mismatch",
      });
    }

    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          message: "User not found",
          error: "User does not exist",
        },
        { status: 404 }
      );
    }

    const account = await Account.findOne({ user: user._id.toString() });

    if (account && account.accountDetails.bankCode === "PALMPAY") {
      return NextResponse.json(
        {
          status: "error",
          message: "Account already exists",
          error: "Account number already generated",
        },
        { status: 400 }
      );
    }

    const { isAccountCreated, errorMessage: err } =
      await processAccountNumberForUser(user);

    if (!isAccountCreated) {
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to generate account number",
          error: err || "Unknown error",
        },
        {
          status: 500,
        }
      );
    }

    if (isAccountCreated) {
      const email = `
     
Dear ${user.fullName},

<span style="color: #2ecc71;">We're excited to inform you that your dedicated account number has been successfully generated! 🎉</span>

<span style="color: #27ae60;">This new account number is designed to make funding your Kinta wallet even faster and more convenient. If you had a previous account number, don't worry - it's still active and you can continue using it to fund your account.</span>

<span style="color: #16a085;">Your new dedicated account details will be visible in your dashboard. This account is specifically assigned to you, making transactions more seamless and efficient.</span>

<span style="color: #2ecc71;">Remember:</span>
<span style="color: #27ae60;">
- Both your old and new account numbers remain valid
- You can use either account number to fund your wallet
- This new account is optimized for faster processing</span>

<span style="color: #16a085;">Thank you for choosing Kinta! If you have any questions, please don't hesitate to reach out to our support team.</span>

<span style="color: #2ecc71;">Best regards,
The Kinta Team</span>
     
      `;

      sendEmail([user.auth.email], email, "Account Number Updated 🎊");
    }

    return NextResponse.json(
      {
        status: "ok",
        message: "Account number generated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to generate account number",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}

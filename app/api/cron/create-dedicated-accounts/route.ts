import { NextRequest, NextResponse } from "next/server";
import {
  connectToDatabase,
  processAccountNumberForUser,
  sendEmail,
} from "@/_lib/utils";
import { User } from "@/models/user";
import { Account } from "@/models/account";
import { verifySignature } from "@upstash/qstash/nextjs";

// Maximum number of users to process in a single run to prevent timeouts
const MAX_USERS_PER_RUN = 50;

async function handler(request: NextRequest) {
  // Verify qStash signature
  const signature = request.headers.get("upstash-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Unauthorized: Missing signature" },
      { status: 401 }
    );
  }

  // Allow test-signature in development environment
  const isDev = process.env.NODE_ENV === "development";
  if (isDev && signature === "test-signature") {
    console.log("Development mode: Accepting test signature");
  } else {
    // In production, verify the signature
    // TODO: Implement proper signature verification with qStash keys
    // const isValid = verifySignature(signature, await request.text());
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Unauthorized: Invalid signature' }, { status: 401 });
    // }
  }
  try {
    // Connect to the database
    await connectToDatabase();

    console.log(
      "Starting cron job to create dedicated accounts for users without them"
    );

    // Find users without dedicated accounts
    // First, find users who are active and email verified
    const activeUsers = await User.find({
      isEmailVerified: true,
      status: "active",
    });

    if (!activeUsers || activeUsers.length === 0) {
      return NextResponse.json(
        {
          status: "ok",
          message: "No active users found to process",
        },
        { status: 200 }
      );
    }

    console.log(
      `Found ${activeUsers.length} active users to check for dedicated accounts`
    );

    // Get user IDs who already have dedicated accounts
    const usersWithAccounts = await Account.find(
      { hasDedicatedAccountNumber: true },
      "user"
    );
    const userIdsWithAccounts = new Set(
      usersWithAccounts.map((account) => account.user.toString())
    );

    // Filter users who don't have dedicated accounts
    const usersWithoutAccounts = activeUsers.filter(
      (user) => !userIdsWithAccounts.has(user._id.toString())
    );

    if (usersWithoutAccounts.length === 0) {
      return NextResponse.json(
        {
          status: "ok",
          message: "All active users already have dedicated accounts",
        },
        { status: 200 }
      );
    }

    console.log(
      `Found ${usersWithoutAccounts.length} users without dedicated accounts`
    );

    // Limit the number of users to process to prevent timeouts
    const usersToProcess = usersWithoutAccounts.slice(0, MAX_USERS_PER_RUN);
    console.log(
      `Processing ${usersToProcess.length} users in this run (limited to ${MAX_USERS_PER_RUN} per run)`
    );

    let processedCount = 0;
    let successCount = 0;

    // Process each user in the filtered list
    for (const user of usersToProcess) {
      try {
        processedCount++;

        // Create dedicated account for user
        const { isAccountCreated, errorMessage } =
          await processAccountNumberForUser(user);

        if (isAccountCreated) {
          successCount++;

          // Send email notification to user
          const email = `
          <span style="color: #2ecc71;">Dear ${user.fullName},</span>

          <span style="color: #27ae60;">We're excited to inform you that your dedicated account number has been successfully generated! 🎉</span>
          
          <span style="color: #16a085;">This new account number is designed to make funding your Kinta wallet even faster and more convenient.</span>
          
          <span style="color: #2ecc71;">Your new dedicated account details are now visible in your dashboard. This account is specifically assigned to you, making transactions more seamless and efficient.</span>
          
          <span style="color: #27ae60;">Thank you for choosing Kinta! If you have any questions, please don't hesitate to reach out to our support team.</span>
          
          <span style="color: #16a085;">Best regards,<br>
          The Kinta Team</span>
          `;

          await sendEmail(
            [user.auth.email],
            email,
            "Your Dedicated Account Number is Ready! 🎊"
          );

          console.log(
            `Successfully created dedicated account for user: ${user._id}`
          );
        } else {
          console.error(
            `Failed to create dedicated account for user: ${user._id}. Error: ${errorMessage}`
          );
        }
      } catch (userError) {
        console.error(
          `Error processing user ${user._id}: ${
            userError instanceof Error ? userError.message : "Unknown error"
          }`
        );
      }
    }

    // Calculate remaining users to be processed in future runs
    const remainingUsers = usersWithoutAccounts.length - usersToProcess.length;

    return NextResponse.json(
      {
        status: "ok",
        message: `Cron job completed. Processed ${processedCount} users without dedicated accounts. Successfully created ${successCount} accounts.`,
        data: {
          totalUsersWithoutAccounts: usersWithoutAccounts.length,
          processedInThisRun: usersToProcess.length,
          remainingUsers: remainingUsers,
          successCount: successCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Cron job error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to process users",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Wrap the handler with verifySignature middleware for qStash
//@ts-ignore
export const POST = verifySignature(handler);

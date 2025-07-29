import { Transaction } from "@/models/transaction";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

interface BalanceCorrectionRequest {
  tx_ref: string;
  old_balance?: number;
  new_balance: number;
}

interface ApiResponse {
  status: "success" | "error";
  message: string;
  data?: any;
  error?: string;
}

/**
 * POST /api/transactions/correct-balance
 * Corrects user balance based on transaction reference
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const body: BalanceCorrectionRequest = await request.json();
    const { tx_ref, old_balance, new_balance } = body;

    // Validate required fields
    if (!tx_ref || typeof tx_ref !== "string") {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Transaction reference (tx_ref) is required and must be a string",
        },
        { status: 400 }
      );
    }

    if (new_balance === undefined || typeof new_balance !== "number") {
      return NextResponse.json(
        {
          status: "error",
          message: "New balance is required and must be a number",
        },
        { status: 400 }
      );
    }

    // Find transaction by reference
    const transaction = await Transaction.findOne({ tx_ref }).lean();
    if (!transaction) {
      return NextResponse.json(
        {
          status: "error",
          message: "Transaction not found",
        },
        { status: 404 }
      );
    }

    // Find associated user
    const user = await User.findById(transaction.user);
    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          message: "User associated with transaction not found",
        },
        { status: 404 }
      );
    }

    // Check if balance correction is needed
    if (user.balance === new_balance) {
      return NextResponse.json(
        {
          status: "success",
          message: "User balance is already correct",
          data: {
            current_balance: user.balance,
            transaction_id: transaction._id,
          },
        },
        { status: 200 }
      );
    }

    // Perform balance correction
    const updateResult = await User.findByIdAndUpdate(
      transaction.user,
      {
        $set: {
          balance: new_balance,
          canUserMakeTransaction: true,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updateResult) {
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to update user balance",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "User balance corrected successfully",
        data: {
          user_id: updateResult._id,
          old_balance: user.balance,
          new_balance: updateResult.balance,
          transaction_ref: tx_ref,
          can_make_transaction: updateResult.canUserMakeTransaction,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in balance correction endpoint:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid JSON format in request body",
        },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      return NextResponse.json(
        {
          status: "error",
          message: "Validation error occurred",
          error:
            error instanceof Error ? error.message : "Unknown validation error",
        },
        { status: 400 }
      );
    }

    // Handle database connection errors
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "MongoNetworkError"
    ) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection error",
        },
        { status: 503 }
      );
    }

    // Generic error handler
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error occurred while correcting balance",
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: 500 }
    );
  }
}

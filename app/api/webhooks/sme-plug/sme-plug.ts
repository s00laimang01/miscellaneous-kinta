import { connectToDatabase } from "@/_lib/utils";
import { Transaction } from "@/models/transaction";
import { User } from "@/models/user";
import { ISmePlugWebhook } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { transaction } = (await request.json()) as ISmePlugWebhook;

    const { status, reference, customer_reference } = transaction;

    await connectToDatabase();

    const _transaction = await Transaction.findOne({
      $or: [{ tx_ref: customer_reference }, { tx_ref: reference }],
    });

    if (!_transaction) {
      return NextResponse.json(
        {
          message: "Transaction with this reference not found.",
          status: 404,
        },
        { status: 404 }
      );
    }

    if (
      _transaction.status === "success" ||
      _transaction.status === "refunded"
    ) {
      return NextResponse.json(
        {
          message:
            "Transaction with this reference has already been completed.",
          status: 400,
        },
        { status: 400 }
      );
    }

    if (status === "failed") {
      //Refund the user

      const user = await User.findById(_transaction.user);

      if (!user) {
        return NextResponse.json(
          {
            message: "User not found.",
            status: 404,
          },
          { status: 404 }
        );
      }

      user.balance += _transaction.amount;

      _transaction.status = "refunded";

      await user.save();
      await _transaction.save();
    }

    return NextResponse.json({
      message: "Transaction updated successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}

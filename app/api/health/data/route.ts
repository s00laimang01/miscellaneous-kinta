import { connectToDatabase } from "@/_lib/utils";
import { Transaction } from "@/models/transaction";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    //Get all data transactions in the last hour
    const transactions = await Transaction.find({
      type: "data",
      createdAt: {
        $gte: new Date(Date.now() - 2000 * 60 * 60),
      },
    });

    const failedTransactions = transactions.filter(
      (transaction) =>
        transaction.status === "failed" || transaction.status === "refunded"
    );

    const successTransactions = transactions.filter(
      (transaction) => transaction.status === "success"
    );

    const data = {
      successRate: successTransactions.length / transactions.length,
      failureRate: failedTransactions.length / transactions.length,
    };

    return NextResponse.json({
      message: "Data transactions health status",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error fetching data transactions health status",
        error,
      },
      { status: 500 }
    );
  }
}

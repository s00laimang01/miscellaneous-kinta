import { NextRequest, NextResponse } from "next/server";
import { scheduleCreateDedicatedAccountsCron, listScheduledCronJobs, deleteScheduledCronJob } from "@/qstash.config";

export async function POST(request: NextRequest) {
  try {
    const { action, scheduleId, signature } = await request.json();

    // Verify signature for security
    if (signature !== process.env.SIGNATURE) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid signature",
          error: "Signature mismatch",
        },
        { status: 401 }
      );
    }

    // Handle different actions
    switch (action) {
      case "schedule":
        // Schedule the cron job
        const scheduleResponse = await scheduleCreateDedicatedAccountsCron();
        return NextResponse.json(
          {
            status: "ok",
            message: "Cron job scheduled successfully",
            data: scheduleResponse,
          },
          { status: 200 }
        );

      case "list":
        // List all scheduled cron jobs
        const schedules = await listScheduledCronJobs();
        return NextResponse.json(
          {
            status: "ok",
            message: "Scheduled cron jobs retrieved successfully",
            data: schedules,
          },
          { status: 200 }
        );

      case "delete":
        // Delete a scheduled cron job
        if (!scheduleId) {
          return NextResponse.json(
            {
              status: "error",
              message: "Schedule ID is required for delete action",
            },
            { status: 400 }
          );
        }

        await deleteScheduledCronJob(scheduleId);
        return NextResponse.json(
          {
            status: "ok",
            message: `Cron job ${scheduleId} deleted successfully`,
          },
          { status: 200 }
        );

      default:
        return NextResponse.json(
          {
            status: "error",
            message: "Invalid action",
            error: `Action '${action}' not supported`,
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error managing cron job:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to manage cron job",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
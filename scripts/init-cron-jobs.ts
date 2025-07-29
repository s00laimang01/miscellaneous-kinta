import { scheduleCreateDedicatedAccountsCron } from "../qstash.config";

/**
 * This script initializes all cron jobs for the application.
 * It can be run manually or as part of the deployment process.
 */
async function initCronJobs() {
  console.log("Initializing cron jobs...");

  try {
    // Schedule the create dedicated accounts cron job
    const dedicatedAccountsSchedule = await scheduleCreateDedicatedAccountsCron();
    console.log("✅ Successfully scheduled create-dedicated-accounts cron job:", dedicatedAccountsSchedule);

    // Add more cron jobs here as needed

    console.log("✅ All cron jobs initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize cron jobs:", error);
    process.exit(1);
  }
}

// Run the initialization function
initCronJobs();
import { Client } from '@upstash/qstash';

// Initialize qStash client
const qstash = new Client({
  token: process.env.QSTASH_TOKEN || '',
});

// Function to schedule the cron job
export async function scheduleCreateDedicatedAccountsCron() {
  try {
    // The URL of our API endpoint (adjust based on your deployment environment)
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_API_URL || 'https://miscellaneous-kinta.vercel.app';
    
    const endpoint = `${baseUrl}/api/cron/create-dedicated-accounts`;
    
    // Schedule the cron job to run every 3 hours
    const scheduleResponse = await qstash.schedules.create({
      destination: endpoint,
      cron: '0 */3 * * *', // Run every 3 hours (at minute 0)
    });
    
    console.log('Scheduled create-dedicated-accounts cron job:', scheduleResponse);
    return scheduleResponse;
  } catch (error) {
    console.error('Failed to schedule create-dedicated-accounts cron job:', error);
    throw error;
  }
}

// Function to list all scheduled cron jobs
export async function listScheduledCronJobs() {
  try {
    const schedules = await qstash.schedules.list();
    console.log('Scheduled cron jobs:', schedules);
    return schedules;
  } catch (error) {
    console.error('Failed to list scheduled cron jobs:', error);
    throw error;
  }
}

// Function to delete a scheduled cron job
export async function deleteScheduledCronJob(scheduleId: string) {
  try {
    await qstash.schedules.delete(scheduleId);
    console.log(`Deleted scheduled cron job: ${scheduleId}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete scheduled cron job ${scheduleId}:`, error);
    throw error;
  }
}
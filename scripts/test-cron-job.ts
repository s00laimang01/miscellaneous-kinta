import fetch from 'node-fetch';
import type { Response } from 'node-fetch';

/**
 * This script allows you to manually test the create-dedicated-accounts cron job
 * without waiting for the scheduled time.
 */
async function testCronJob() {
  try {
    console.log('Testing create-dedicated-accounts cron job...');
    
    // Get the base URL from environment or use default
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const endpoint = `${baseUrl}/api/cron/create-dedicated-accounts`;
    
    // Create a mock qStash signature for testing
    // In production, qStash would provide a valid signature
    const mockSignature = 'test-signature';
    
    // Make a POST request to the cron job endpoint
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Upstash-Signature': mockSignature
      }
    });
    
    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response body:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Cron job test completed successfully');
    } else {
      console.error('❌ Cron job test failed');
    }
  } catch (error) {
    console.error('Error testing cron job:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Run the test function
testCronJob();
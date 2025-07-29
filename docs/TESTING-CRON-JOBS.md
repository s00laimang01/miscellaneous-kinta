# Testing Cron Jobs

This document provides detailed information about testing the qStash cron jobs in the Kinta application.

## Overview

The application includes a cron job that automatically creates dedicated account numbers for users who don't have them yet. This job is scheduled to run every 3 hours using qStash.

For development and testing purposes, we've created a script that allows you to manually trigger the cron job without waiting for the scheduled time.

## Test Script

The test script is located at `scripts/test-cron-job.ts` and can be run using the following command:

```bash
npm run test-cron
```

### How It Works

The test script:

1. Makes a POST request to the cron job endpoint (`/api/cron/create-dedicated-accounts`)
2. Includes a mock signature (`test-signature`) in the request headers
3. Displays the response status and body
4. Logs success or failure messages

### Development Mode

The cron job endpoint is configured to accept the mock signature (`test-signature`) only in development mode. In production, proper signature verification would be required.

## Expected Output

When running the test script, you should see output similar to the following:

```
Testing create-dedicated-accounts cron job...
Response status: 200
Response body: {
  "message": "Dedicated accounts created successfully",
  "data": {
    "totalUsersWithoutAccounts": 5,
    "processedInThisRun": 5,
    "remainingUsers": 0,
    "successCount": 5
  }
}
✅ Cron job test completed successfully
```

## Troubleshooting

### Common Issues

1. **Connection Error**

   - Ensure your local development server is running
   - Check that the `NEXT_PUBLIC_API_URL` environment variable is set correctly

2. **Authentication Error**

   - Verify that the cron job endpoint is accepting the mock signature in development mode
   - Check the implementation in `app/api/cron/create-dedicated-accounts/route.ts`

3. **Database Connection Error**

   - Ensure your MongoDB connection string is correct
   - Check that the database is accessible

4. **Empty Results**
   - If no users are processed, it might be because all users already have dedicated accounts
   - Try creating a test user without a dedicated account

## Monitoring

The cron job logs information about its execution, including:

- Total number of users without dedicated accounts
- Number of users processed in the current run
- Number of remaining users to be processed in future runs
- Number of successful account creations

You can use this information to monitor the progress of the cron job and ensure it's working as expected.

## Related Files

- `app/api/cron/create-dedicated-accounts/route.ts`: The cron job endpoint
- `scripts/test-cron-job.ts`: The test script
- `qstash.config.ts`: Configuration for qStash
- `scripts/init-cron-jobs.ts`: Script to initialize cron jobs

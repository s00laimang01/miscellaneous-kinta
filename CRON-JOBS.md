# Cron Jobs with qStash

This document explains how the cron jobs are set up and managed in the application using qStash.

## Overview

We've implemented a cron job that runs every 3 hours to create dedicated account numbers for users who don't have them yet. This automation ensures that all eligible users receive their dedicated account numbers without manual intervention.

## Implementation Details

### 1. Cron Job Endpoint

The main cron job endpoint is located at:
```
/api/cron/create-dedicated-accounts
```

This endpoint:
- Finds all active, email-verified users without dedicated account numbers
- Processes users in batches (maximum 50 per run) to prevent timeouts
- Creates dedicated accounts for these users using the Billstack API
- Sends email notifications to users when their accounts are created
- Returns a summary of the operation, including information about remaining users

### 2. qStash Configuration

The qStash configuration is defined in `qstash.config.ts`. This file contains functions to:
- Schedule the cron job to run every 3 hours
- List all scheduled cron jobs
- Delete specific cron jobs

### 3. Management API

A management API is available at:
```
/api/cron/manage
```

This API allows you to:
- Schedule the cron job
- List all scheduled cron jobs
- Delete specific cron jobs

All management actions require a valid signature for security.

## Setup Instructions

### Prerequisites

1. You need a qStash account from Upstash (https://upstash.com/)
2. Add the following environment variables to your deployment:
   ```
   # Required for qStash client
   QSTASH_TOKEN=your_qstash_token_from_upstash_dashboard
   
   # Required for verifySignature middleware
   QSTASH_CURRENT_SIGNING_KEY=your_qstash_signing_key
   QSTASH_NEXT_SIGNING_KEY=your_qstash_next_signing_key
   
   # Custom signature for the management API
   SIGNATURE=your_custom_signature_for_management_api
   
   # API URL (for proper endpoint construction)
   NEXT_PUBLIC_API_URL=https://your-deployment-url.com
   ```
   
   You can find your qStash token and signing keys in the Upstash dashboard after creating a qStash account.

### Initializing the Cron Job

To initialize the cron job, run:

```bash
npm run init-cron
```

This script will schedule the cron job to run every 3 hours.

### Testing Cron Jobs

For development and testing purposes, you can manually trigger the cron job without waiting for the scheduled time:

```bash
npm run test-cron
```

This script will send a request to the cron job endpoint with a mock signature and display the results.

For detailed information about testing cron jobs, see [TESTING-CRON-JOBS.md](./docs/TESTING-CRON-JOBS.md).

### Managing Cron Jobs Manually

You can manage cron jobs by making POST requests to the management API:

#### Schedule a Cron Job

```bash
curl -X POST https://your-domain.com/api/cron/manage \
  -H "Content-Type: application/json" \
  -d '{"action":"schedule","signature":"your_signature_here"}'
```

#### List All Cron Jobs

```bash
curl -X POST https://your-domain.com/api/cron/manage \
  -H "Content-Type: application/json" \
  -d '{"action":"list","signature":"your_signature_here"}'
```

#### Delete a Cron Job

```bash
curl -X POST https://your-domain.com/api/cron/manage \
  -H "Content-Type: application/json" \
  -d '{"action":"delete","scheduleId":"job_id_here","signature":"your_signature_here"}'
```

## Monitoring

The cron job logs its activity to the console. In production, you should ensure these logs are captured by your logging system.

Key events that are logged:
- Start of the cron job
- Number of users found to process
- Success or failure of account creation for each user
- Summary of the operation (total processed, total successful)

## Troubleshooting

### Common Issues

1. **Cron job not running**
   - Verify that the qStash token is correct
   - Check that the cron job is scheduled by using the list action in the management API
   - Ensure the server URL is accessible from qStash

2. **Signature verification failing**
   - Ensure `QSTASH_CURRENT_SIGNING_KEY` and `QSTASH_NEXT_SIGNING_KEY` are set correctly
   - These keys rotate periodically, so make sure they're up to date

3. **Database connection issues**
   - Check that the MongoDB connection string is correct
   - Ensure the database is accessible from your server

4. **Account creation failing**
   - Check the logs for specific error messages
   - Verify that the Billstack API is accessible and configured correctly

### Viewing Logs

If you're using Vercel for deployment, you can view logs in the Vercel dashboard under the "Logs" tab for your project. Filter for "create-dedicated-accounts" to see logs specific to this cron job.
- Successful account creations
- Failed account creations with error messages
- Completion summary

## Troubleshooting

If the cron job is not running as expected:

1. Check that the qStash token is valid and has sufficient permissions
2. Verify that the cron job is scheduled by using the list action of the management API
3. Check the logs for any error messages
4. Ensure the API endpoint is accessible from qStash servers

## Security Considerations

- The management API is protected by a signature check
- The cron job endpoint is protected by qStash's signature verification
- Make sure to keep your qStash token and signature secret
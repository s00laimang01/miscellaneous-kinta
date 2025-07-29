# Next.js API-Only Application

This is a [Next.js](https://nextjs.org/) project configured to serve as an API-only application. It has CORS enabled specifically for the following domains:
- https://www.kinta-sme.com
- https://www.kinta-sme-server.vercel.app

The application includes automated cron jobs using qStash to create dedicated account numbers for users.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The API will be available at [http://localhost:3000/api](http://localhost:3000/api).

## API Routes

The application is configured to only serve API routes. All routes are defined in the `app/api` directory.

Example API endpoints:
- GET/POST `/api/hello` - A sample endpoint that returns a greeting message
- POST `/api/generate-dedicated-account-number` - Generates a dedicated account number for a user
- POST `/api/cron/create-dedicated-accounts` - Cron job endpoint to create dedicated accounts for users without them
- POST `/api/cron/manage` - Endpoint to manage cron job schedules

## CORS Configuration

CORS is configured in the `middleware.ts` file to allow requests from the specified domains. If you need to add more allowed origins, update the `allowedOrigins` array in this file.

## Deployment

This application can be deployed to any platform that supports Next.js, such as Vercel or Netlify.

## Cron Jobs

The application uses qStash for scheduling cron jobs. To initialize the cron jobs:

```bash
npm run init-cron
```

For development and testing purposes, you can manually trigger the cron job:

```bash
npm run test-cron
```

For more details on the cron job implementation, see [CRON-JOBS.md](./CRON-JOBS.md).

## Documentation

- [CSP-README.md](./CSP-README.md) - Guide for implementing Content Security Policy
- [CSP-SOLUTION.md](./CSP-SOLUTION.md) - Detailed explanation of the CSP solution
- [CRON-JOBS.md](./CRON-JOBS.md) - Overview of the qStash cron job implementation
- [docs/](./docs/) - Additional detailed documentation
  - [TESTING-CRON-JOBS.md](./docs/TESTING-CRON-JOBS.md) - Guide for testing cron jobs

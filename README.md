# Next.js API-Only Application

This is a [Next.js](https://nextjs.org/) project configured to serve as an API-only application. It has CORS enabled specifically for the following domains:
- https://www.kinta-sme.com
- https://www.kinta-sme-server.vercel.app

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

Example API endpoint:
- GET/POST `/api/hello` - A sample endpoint that returns a greeting message

## CORS Configuration

CORS is configured in the `middleware.ts` file to allow requests from the specified domains. If you need to add more allowed origins, update the `allowedOrigins` array in this file.

## Deployment

This application can be deployed to any platform that supports Next.js, such as Vercel or Netlify.

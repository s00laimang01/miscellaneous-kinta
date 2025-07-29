# Content Security Policy (CSP) Implementation Guide

## Overview

This guide provides instructions for implementing Content Security Policy (CSP) to allow your frontend application at `www.kinta-sme.com` to connect to the API server at `https://miscellaneous-kinta.vercel.app`.

## Problem

You're encountering a CSP error:

```
Refused to connect to 'https://miscellaneous-kinta.vercel.app/api/generate-dedicated-account-number' because it violates the following Content Security Policy directive: "connect-src 'self'"
```

This occurs because your frontend application has a restrictive CSP that only allows connections to the same origin (`'self'`).

## Solution Options

### Option 1: Server-side CSP Headers (Already Implemented)

The API server has been configured with appropriate CORS and CSP headers in:
- `middleware.ts` - Handles CORS headers
- `next.config.ts` - Configures CSP headers

However, these changes only affect the server side and don't resolve client-side CSP restrictions.

### Option 2: Client-side CSP Configuration

To fix the issue in your frontend application, you need to modify the CSP configuration in your client application. Here are several ways to do this:

#### A. Using Meta Tags

Add the following meta tag to the `<head>` section of your HTML:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; connect-src 'self' https://miscellaneous-kinta.vercel.app https://www.kinta-sme.com https://www.kinta-sme-server.vercel.app *; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';">
```

#### B. Using the Provided JavaScript File

We've created a `csp-config.js` file in the `public` directory. Include this script in your HTML:

```html
<script src="https://miscellaneous-kinta.vercel.app/csp-config.js"></script>
```

This script dynamically adds the necessary CSP meta tag to your page.

#### C. Using HTTP Headers

If you have control over your frontend server configuration, add the following header to your HTTP responses:

```
Content-Security-Policy: default-src 'self'; connect-src 'self' https://miscellaneous-kinta.vercel.app https://www.kinta-sme.com https://www.kinta-sme-server.vercel.app *; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';
```

## Testing

After implementing one of these solutions, you can test the connection using the provided test files:

- `test-cors.html` - A browser-based test page
- `test-csp.js` - A Node.js script for testing API connections

## Additional Notes

1. The wildcard (`*`) in the connect-src directive allows connections to any domain. For production, you may want to restrict this to only the specific domains you need.

2. If you're using a Content Security Policy management tool or framework, consult its documentation for how to update the CSP configuration.

3. Remember that CSP is enforced by the browser, so the configuration must be present in the HTML that the browser receives.

4. For Next.js applications, you can also use the `next/head` component to add the CSP meta tag.

## Support

If you continue to experience issues after implementing these solutions, please provide:

1. The exact error message from your browser's console
2. The current CSP configuration from your frontend application
3. The network request details from your browser's developer tools
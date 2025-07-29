# Content Security Policy (CSP) Solution Guide

## Problem Description

You're experiencing a Content Security Policy (CSP) error when making requests from `www.kinta-sme.com` to `https://miscellaneous-kinta.vercel.app/api/generate-dedicated-account-number`. The error message is:

```
Refused to connect to 'https://miscellaneous-kinta.vercel.app/api/generate-dedicated-account-number' because it violates the following Content Security Policy directive: "connect-src 'self'"
```

This error occurs because the CSP on `www.kinta-sme.com` is restricting connections to only the same origin ('self'), preventing cross-origin requests to the API endpoint.

## Solution Overview

We've implemented a multi-layered solution to address this issue:

1. **Server-side CSP Configuration**: Modified the Next.js application to properly handle CSP headers
2. **CORS Configuration**: Enhanced CORS handling to support multiple origins
3. **Client-side CSP Configuration**: Created options for implementing CSP in the client application

## Implemented Changes

### 1. Server-side CSP Configuration

We've updated `next.config.ts` to:

- Apply general security headers to all routes
- Apply a permissive CSP specifically for API routes with `connect-src * 'self'`
- Apply a separate CSP for client-side routes with appropriate `connect-src` directives

### 2. CORS Configuration

We've enhanced `middleware.ts` to:

- Support multiple origin variations (with/without `https://`, with/without `www`)
- Set appropriate CORS headers based on the request origin
- Default to a permissive configuration in development mode

### 3. Client-side CSP Configuration

We've created multiple options for implementing CSP in the client application:

#### Option 1: Add CSP Meta Tag to HTML

Add the following meta tag to the `<head>` section of your HTML on `www.kinta-sme.com`:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; connect-src 'self' https://miscellaneous-kinta.vercel.app https://www.kinta-sme.com https://www.kinta-sme-server.vercel.app *; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';">
```

This allows connections to the API endpoint while maintaining security for other resources.

#### Option 2: Use the Provided JavaScript File

We've created a JavaScript file (`csp-config.js`) that dynamically sets the CSP meta tag. Include it in your HTML:

```html
<script src="/csp-config.js"></script>
```

#### Option 3: Configure CSP via HTTP Headers

If you have access to the server configuration for `www.kinta-sme.com`, add the following header to your HTTP responses:

```
Content-Security-Policy: default-src 'self'; connect-src 'self' https://miscellaneous-kinta.vercel.app https://www.kinta-sme.com https://www.kinta-sme-server.vercel.app *; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';
```

## Testing

We've created several test tools to verify the solution:

1. **Server-side Test**: `test-csp-direct.js` - Tests API connectivity with various origins
2. **Browser Test**: `public/test-csp-browser.html` - Tests CSP in a browser environment

The tests confirm that:

- The API properly handles CORS requests from various origins
- The CSP configuration allows connections to the API endpoint
- All security headers are correctly set

## Implementation Steps for www.kinta-sme.com

1. Choose one of the client-side CSP configuration options above
2. Implement the chosen solution on your `www.kinta-sme.com` website
3. Test the connection to ensure it works properly

## Additional Notes

- The CSP configuration uses wildcards (`*`) for maximum compatibility, but you can restrict it further for production environments
- The CORS configuration supports multiple origin variations for flexibility
- If you're using a Content Management System (CMS) or framework, consult their documentation for the best way to implement CSP

## Troubleshooting

If you continue to experience issues:

1. Check browser console for specific error messages
2. Verify that the CSP meta tag or header is correctly applied
3. Ensure that the API endpoint is accessible and responding correctly
4. Test with the provided test tools to isolate the issue

## Resources

- [Content Security Policy (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
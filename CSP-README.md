# Content Security Policy (CSP) Implementation Guide

## Overview

This repository contains solutions for implementing Content Security Policy (CSP) to allow cross-origin requests from `www.kinta-sme.com` to the API endpoint at `https://miscellaneous-kinta.vercel.app/api/generate-dedicated-account-number`.

## Problem

The error message you're encountering:

```
Refused to connect to 'https://miscellaneous-kinta.vercel.app/api/generate-dedicated-account-number' because it violates the following Content Security Policy directive: "connect-src 'self'"
```

This occurs because the CSP on `www.kinta-sme.com` is restricting connections to only the same origin ('self'), preventing cross-origin requests to the API endpoint.

## Solution Files

This repository includes the following solution files:

1. **CSP-SOLUTION.md** - Comprehensive guide explaining the problem and all available solutions
2. **public/csp-config.js** - JavaScript file to dynamically set CSP meta tags
3. **public/csp-implementation-example.html** - Example HTML page demonstrating CSP implementation
4. **public/test-csp-browser.html** - Test page for verifying CSP configuration in a browser

## Implementation Options

### Option 1: Add CSP Meta Tag to HTML

Add the following meta tag to the `<head>` section of your HTML on `www.kinta-sme.com`:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; connect-src 'self' https://miscellaneous-kinta.vercel.app https://www.kinta-sme.com https://www.kinta-sme-server.vercel.app *; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';">
```

### Option 2: Use the Provided JavaScript File

Copy the `csp-config.js` file to your website and include it in your HTML:

```html
<script src="/csp-config.js"></script>
```

### Option 3: Configure CSP via HTTP Headers

If you have access to the server configuration for `www.kinta-sme.com`, add the following header to your HTTP responses:

```
Content-Security-Policy: default-src 'self'; connect-src 'self' https://miscellaneous-kinta.vercel.app https://www.kinta-sme.com https://www.kinta-sme-server.vercel.app *; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';
```

## Testing

To test the CSP implementation:

1. Implement one of the options above on your website
2. Open the browser console (F12 or right-click > Inspect > Console)
3. Make a request to the API endpoint
4. Verify that no CSP errors appear in the console

Alternatively, you can use the provided test files:

- `public/csp-implementation-example.html` - Example implementation with test buttons
- `public/test-csp-browser.html` - More detailed testing page

## Server-Side Changes

We've also made the following server-side changes to ensure proper CORS and CSP handling:

1. Updated `middleware.ts` to support multiple origin variations
2. Modified `next.config.ts` to apply appropriate CSP headers

These changes ensure that the server properly responds to cross-origin requests with appropriate headers.

## Troubleshooting

If you continue to experience issues:

1. Check browser console for specific error messages
2. Verify that the CSP meta tag or header is correctly applied
3. Ensure that the API endpoint is accessible and responding correctly
4. Test with the provided test files to isolate the issue

## Resources

- [Content Security Policy (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
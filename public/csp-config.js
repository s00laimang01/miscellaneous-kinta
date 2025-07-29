/**
 * Content Security Policy (CSP) Configuration Script
 * 
 * This script dynamically adds a CSP meta tag to the document head
 * to allow connections to the API endpoint while maintaining security.
 * 
 * Include this script in the <head> section of your HTML before any other scripts:
 * <script src="/csp-config.js"></script>
 */

(function() {
  // Create meta element for Content-Security-Policy
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  
  // Configure CSP directives
  const cspContent = [
    // Default policy - restrict to same origin
    "default-src 'self'",
    
    // Connection sources - allow API endpoints and any origin (*)
    "connect-src 'self' https://miscellaneous-kinta.vercel.app https://www.kinta-sme.com https://www.kinta-sme-server.vercel.app *",
    
    // Image sources - allow same origin, data URIs, and HTTPS images
    "img-src 'self' data: https:",
    
    // Script sources - allow same origin and inline scripts (for development)
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    
    // Style sources - allow same origin and inline styles
    "style-src 'self' 'unsafe-inline'"
  ].join('; ');
  
  // Set the content attribute
  cspMeta.content = cspContent;
  
  // Add the meta tag to the head
  const head = document.head || document.getElementsByTagName('head')[0];
  if (head) {
    // Insert at the beginning of head to ensure it takes effect before resources load
    head.insertBefore(cspMeta, head.firstChild);
    
    console.log('CSP configuration applied successfully');
  } else {
    console.error('Could not find document head to add CSP meta tag');
  }
})();
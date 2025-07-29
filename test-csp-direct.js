// Test script to verify CSP configuration

(async () => {
  try {
    console.log('Starting CSP test...');
    console.log('Testing connection to: https://miscellaneous-kinta.vercel.app/api/generate-dedicated-account-number');
    
    // Import fetch dynamically
    const { default: fetch } = await import('node-fetch');
    
    // Test with different origins
    const origins = [
      'https://www.kinta-sme.com',
      'http://www.kinta-sme.com',
      'https://kinta-sme.com',
      'http://localhost:3000',
      'http://localhost:3002',
      'https://example.com' // Should still work with wildcard
    ];
    
    for (const origin of origins) {
      console.log(`\n\nTesting with Origin: ${origin}`);
      
      try {
        const response = await fetch('https://miscellaneous-kinta.vercel.app/api/generate-dedicated-account-number', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': origin
          },
          body: JSON.stringify({
            userId: 'test-user-id',
            signature: 'test-signature'
          })
        });
        
        console.log(`Status: ${response.status} ${response.statusText}`);
        
        // Log CORS headers
        console.log('CORS Headers:');
        console.log(`Access-Control-Allow-Origin: ${response.headers.get('access-control-allow-origin')}`);
        console.log(`Access-Control-Allow-Methods: ${response.headers.get('access-control-allow-methods')}`);
        console.log(`Access-Control-Allow-Headers: ${response.headers.get('access-control-allow-headers')}`);
        
        // Log response body
        const text = await response.text();
        console.log('Response Body:');
        console.log(text);
        
        console.log(`Test with origin ${origin}: SUCCESS`);
      } catch (error) {
        console.error(`Test with origin ${origin}: FAILED`);
        console.error(`Error: ${error.message}`);
      }
    }
    
    console.log('\n\nCSP Test completed.');
  } catch (error) {
    console.error('Test script error:', error);
  }
})();
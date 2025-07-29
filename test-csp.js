// Test script to verify CORS and Content Security Policy

// Using dynamic import for node-fetch (ESM module)
async function testAPI() {
  try {
    const { default: fetch } = await import('node-fetch');
    console.log('Testing API with CORS and CSP configuration...');
    console.log('Starting test at:', new Date().toISOString());
    
    // Test with different origins
    const origins = [
      'https://www.kinta-sme.com',
      'https://www.kinta-sme-server.vercel.app',
      'https://miscellaneous-kinta.vercel.app',
      'https://example.com' // Not allowed origin for testing
    ];

    // Test both deployed and local endpoints
    const endpoints = [
      'https://miscellaneous-kinta.vercel.app/api/generate-dedicated-account-number',
      'http://localhost:3001/api/generate-dedicated-account-number'
    ];

    for (const endpoint of endpoints) {
      console.log(`\n\nTesting endpoint: ${endpoint}`);
      
      for (const origin of origins) {
        console.log(`\nTesting with Origin: ${origin}`);
        
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Origin': origin
            },
            body: JSON.stringify({
              userId: 'test-user-id',
              signature: process.env.SIGNATURE || 'test-signature'
            })
          });
          
          // Extract and log CORS headers
          const corsHeaders = {
            'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
            'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
            'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
            'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
          };
          
          console.log('Status:', response.status);
          console.log('CORS Headers:', corsHeaders);
          
          // Try to parse response as JSON
          try {
            const data = await response.json();
            console.log('Response data:', data);
          } catch (e) {
            console.log('Could not parse response as JSON');
          }
        } catch (error) {
          console.error(`Error testing with origin ${origin}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

// Run the test
testAPI();

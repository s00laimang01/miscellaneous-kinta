// Simple script to test the API endpoints
// Run with: node test-api.js

async function testApi() {
  console.log('Testing API endpoints...');
  
  // Get the current server URL
  const serverUrl = 'http://localhost:3001'; // Update this to match your current server port
  
  // Test health endpoint
  try {
    console.log('\nTesting /api/health endpoint:');
    const healthResponse = await fetch(`${serverUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('Status:', healthResponse.status);
    console.log('Response:', healthData);
  } catch (error) {
    console.error('Error testing health endpoint:', error.message);
  }
  
  // Test hello endpoint (GET)
  try {
    console.log('\nTesting /api/hello endpoint (GET):');
    const helloResponse = await fetch(`${serverUrl}/api/hello`);
    const helloData = await helloResponse.json();
    console.log('Status:', helloResponse.status);
    console.log('Response:', helloData);
  } catch (error) {
    console.error('Error testing hello endpoint (GET):', error.message);
  }
  
  // Test hello endpoint (POST)
  try {
    console.log('\nTesting /api/hello endpoint (POST):');
    const postResponse = await fetch(`${serverUrl}/api/hello`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://miscellaneous-kinta.vercel.app'
      },
      body: JSON.stringify({ test: 'data', from: 'test script' }),
    });
    const postData = await postResponse.json();
    console.log('Status:', postResponse.status);
    console.log('Response:', postData);
  } catch (error) {
    console.error('Error testing hello endpoint (POST):', error.message);
  }
  
  // Test generate-dedicated-account-number endpoint
  try {
    console.log('\nTesting /api/generate-dedicated-account-number endpoint:');
    const accountResponse = await fetch(`${serverUrl}/api/generate-dedicated-account-number`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://miscellaneous-kinta.vercel.app'
      },
      body: JSON.stringify({
        userId: 'test-user-id',
        signature: process.env.SIGNATURE || 'test-signature'
      }),
    });
    
    // Check if the response is JSON
    const contentType = accountResponse.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const accountData = await accountResponse.json();
      console.log('Status:', accountResponse.status);
      console.log('Response:', accountData);
    } else {
      const text = await accountResponse.text();
      console.log('Status:', accountResponse.status);
      console.log('Response (text):', text);
    }
    
    // Log the CORS headers
    console.log('CORS Headers:');
    console.log('Access-Control-Allow-Origin:', accountResponse.headers.get('access-control-allow-origin'));
    console.log('Access-Control-Allow-Methods:', accountResponse.headers.get('access-control-allow-methods'));
    console.log('Access-Control-Allow-Headers:', accountResponse.headers.get('access-control-allow-headers'));
  } catch (error) {
    console.error('Error testing generate-dedicated-account-number endpoint:', error.message);
  }
}

testApi();
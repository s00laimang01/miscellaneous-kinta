// Simple script to test the API endpoints
// Run with: node test-api.js

async function testApi() {
  console.log('Testing API endpoints...');
  
  // Test health endpoint
  try {
    console.log('\nTesting /api/health endpoint:');
    const healthResponse = await fetch('http://localhost:3002/api/health');
    const healthData = await healthResponse.json();
    console.log('Status:', healthResponse.status);
    console.log('Response:', healthData);
  } catch (error) {
    console.error('Error testing health endpoint:', error.message);
  }
  
  // Test hello endpoint (GET)
  try {
    console.log('\nTesting /api/hello endpoint (GET):');
    const helloResponse = await fetch('http://localhost:3002/api/hello');
    const helloData = await helloResponse.json();
    console.log('Status:', helloResponse.status);
    console.log('Response:', helloData);
  } catch (error) {
    console.error('Error testing hello endpoint (GET):', error.message);
  }
  
  // Test hello endpoint (POST)
  try {
    console.log('\nTesting /api/hello endpoint (POST):');
    const postResponse = await fetch('http://localhost:3002/api/hello', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: 'data', from: 'test script' }),
    });
    const postData = await postResponse.json();
    console.log('Status:', postResponse.status);
    console.log('Response:', postData);
  } catch (error) {
    console.error('Error testing hello endpoint (POST):', error.message);
  }
}

testApi();
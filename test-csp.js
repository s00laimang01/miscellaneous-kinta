// Test script to verify CORS and Content Security Policy

// Using dynamic import for node-fetch (ESM module)
async function testAPI() {
  console.log("Starting test-csp.js script...");
  try {
    console.log("Importing node-fetch...");
    const { default: fetch } = await import("node-fetch");
    console.log("Successfully imported node-fetch");
    console.log("Testing API with CORS and CSP configuration...");
    console.log("Starting test at:", new Date().toISOString());

    try {
      // Test the generate-dedicated-account-number endpoint
      const response = await fetch(
        "https://miscellaneous-kinta.vercel.app/api/generate-dedicated-account-number",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "https://miscellaneous-kinta.vercel.app",
          },
          body: JSON.stringify({
            userId: "test-user-id",
            signature: process.env.SIGNATURE || "test-signature",
          }),
        }
      );

      const data = await response.json();
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      console.log("Response data:", data);
    } catch (error) {
      console.error("Error testing API:", error.message);
    }
  } catch (error) {
    console.error("Error testing API:", error.message);
  }
}

testAPI();

const API_URL = "http://localhost:3000/api/bookings";
const NUM_REQUESTS = 20;

// Everyone tries to book Session 1, Seat 1
const payload = {
  user_id: 1, 
  session_id: 1,
  seat_ids: [1] 
};

async function sendRequest(requestId) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.status === 201) {
      console.log(`Request #${requestId} SUCCEEDED (Booking Created)`);
      return "success";
    } else if (response.status === 409) {
      console.log(`Request #${requestId} BLOCKED (Seat already taken)`);
      return "blocked";
    } else {
      console.log(`Request #${requestId} FAILED with status ${response.status}`);
      return "error";
    }
  } catch (error) {
    console.log(`Request #${requestId} NETWORK ERROR:`, error.message);
    return "error";
  }
}

async function runTest() {
  console.log(`Starting Stress Test: ${NUM_REQUESTS} concurrent requests...`);
  
  // Create an array of requests
  const promises = [];
  for (let i = 1; i <= NUM_REQUESTS; i++) {
    promises.push(sendRequest(i));
  }

  // Fire them all at the same time
  const results = await Promise.all(promises);

  // Analyze results
  const successCount = results.filter(r => r === "success").length;
  const blockedCount = results.filter(r => r === "blocked").length;

  console.log("\n--- REPORT ---");
  console.log(`Total Requests: ${NUM_REQUESTS}`);
  console.log(`Successful Bookings: ${successCount}`);
  console.log(`Blocked (Correctly): ${blockedCount}`);

  if (successCount === 1 && blockedCount === (NUM_REQUESTS - 1)) {
    console.log("TEST PASSED: Database locking is working perfectly!");
  } else {
    console.log("TEST FAILED: Race condition detected.");
  }
}

runTest();
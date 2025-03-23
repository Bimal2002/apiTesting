const axios = require("axios");

const BASE_URL = "http://35.200.185.69:8000";

const API_VERSIONS = ["v1", "v2", "v3"];

const TEST_QUERY = "a";

const MAX_REQUESTS = 10000;

async function testRateLimit(apiVersion) {
  const apiUrl = `${BASE_URL}/${apiVersion}/autocomplete`;
  let successfulRequests = 0;
  let rateLimited = false;
  let startTime, resetTime;

  console.log(`\n Starting rate limit test for ${apiVersion}...`);

  for (let i = 0; i < MAX_REQUESTS; i++) {
    try {
      const response = await axios.get(`${apiUrl}?query=${TEST_QUERY}`);
      if (response.status === 200) {
        successfulRequests++;
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log(
          ` Rate limit hit after ${successfulRequests} requests for ${apiVersion}.`
        );
        rateLimited = true;
        startTime = Date.now();
        break;
      } else {
        console.log(
          ` Unexpected error (${
            error.response ? error.response.status : error.message
          })`
        );
      }
    }
  }

  if (rateLimited) {
    console.log(` Waiting to see how long it takes for the limit to reset...`);
    let waitMinutes = 0;

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 60000));
      waitMinutes++;

      try {
        const response = await axios.get(`${apiUrl}?query=${TEST_QUERY}`);
        if (response.status === 200) {
          resetTime = (Date.now() - startTime) / 60000; // Convert ms to minutes
          console.log(
            ` Rate limit reset after ${resetTime.toFixed(2)} minutes!`
          );
          break;
        }
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.log(
            ` Still blocked... waited ${waitMinutes} minutes so far.`
          );
        } else {
          console.log(
            ` Unexpected error while checking reset time: ${error.message}`
          );
          break;
        }
      }
    }
  }

  console.log(`\n --- ${apiVersion.toUpperCase()} Rate Limit Test Summary ---`);
  console.log(` Successful Requests Before Block: ${successfulRequests}`);
  console.log(
    ` Rate Limit Reset Time: ${
      resetTime ? resetTime.toFixed(2) : "Unknown"
    } minutes`
  );
}

async function runTests() {
  console.log("\n Starting API rate limit tests...\n");

  for (const version of API_VERSIONS) {
    await testRateLimit(version);
  }

  console.log("\n All rate limit tests completed.");
}

runTests();

const axios = require("axios");

const BASE_URL = "http://35.200.185.69:8000";
const API_VERSIONS = ["v1", "v2", "v3"];

const TEST_QUERIES = {
  Lowercase: "a",
  Uppercase: "A",
  "Mixed Case": "Aa",
  Numbers: "123",
  Alphanumeric: "a1b2c3",
  "Special Characters": "@#$%",
  "Empty Query": "",
  Whitespace: " ",
};

async function queryApi(apiUrl, query) {
  try {
    const response = await axios.get(
      `${apiUrl}?query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.log(
        `Rate limit hit on query '${query}'. Retrying in 5 seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return queryApi(apiUrl, query);
    }

    console.error(
      `Error (${
        error.response ? error.response.status : error.message
      }) for query '${query}'`
    );
    return null;
  }
}

async function testQueries(apiVersion) {
  const apiUrl = `${BASE_URL}/${apiVersion}/autocomplete`;

  console.log(`\nRunning query tests for ${apiVersion}...`);

  for (const [queryType, queryValue] of Object.entries(TEST_QUERIES)) {
    console.log(`Testing: ${queryType} ('${queryValue}')`);

    const response = await queryApi(apiUrl, queryValue);
    console.log(`Response:`, response, "\n");

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function runTests() {
  console.log("\nStarting API query tests...\n");

  for (const version of API_VERSIONS) {
    await testQueries(version);
  }

  console.log("\nAll query tests completed.");
}

runTests();

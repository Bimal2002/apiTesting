const axios = require("axios");

const BASE_URL = "http://35.200.185.69:8000";

const API_VERSIONS = ["v1", "v2", "v3"];

const lowercaseQuery = "a";
const uppercaseQuery = "A";

async function checkCaseSensitivity(apiVersion) {
  const apiUrl = `${BASE_URL}/${apiVersion}/autocomplete`;

  try {
    const responseLower = await axios.get(`${apiUrl}?query=${lowercaseQuery}`);
    const responseUpper = await axios.get(`${apiUrl}?query=${uppercaseQuery}`);

    console.log(`\n Checking case sensitivity for API version: ${apiVersion}`);
    console.log(
      `➡ Lowercase '${lowercaseQuery}' Response:`,
      responseLower.data
    );
    console.log(
      `➡ Uppercase '${uppercaseQuery}' Response:`,
      responseUpper.data
    );

    if (
      JSON.stringify(responseLower.data) === JSON.stringify(responseUpper.data)
    ) {
      console.log(
        ` ${apiVersion} is **case-insensitive** (treats 'a' and 'A' the same).`
      );
    } else {
      console.log(
        ` ${apiVersion} is **case-sensitive** (treats 'a' and 'A' differently).`
      );
    }
  } catch (error) {
    console.error(` Error while testing ${apiVersion}:`, error.message);
  }
}

async function runTests() {
  console.log(" Starting API case sensitivity tests...\n");

  for (const version of API_VERSIONS) {
    await checkCaseSensitivity(version);
  }

  console.log("\n All tests completed.");
}

runTests();

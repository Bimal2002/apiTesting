const axios = require("axios");

const BASE_URL = "http://35.200.185.69:8000";
const API_VERSIONS = ["v1", "v2", "v3"];
const ALPHABET =
  "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+-._~*".split(
    ""
  );
const ENCODED_ALPHABET = [
  ...ALPHABET,
  "%20", // Space
  "%2B", // +
  "%2D", // -
  "%2E", // .
  "%5F", // _
  "%7E", // ~
];

async function queryAPI(apiUrl, prefix) {
  while (true) {
    try {
      const response = await axios.get(`${apiUrl}?query=${prefix}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        const retryAfter = error.response.headers["retry-after"] || 60;
        console.log(
          `Rate limit hit. Waiting ${retryAfter} seconds before retrying '${prefix}'...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      } else {
        console.log(
          `Error (${
            error.response ? error.response.status : error.message
          }) for '${prefix}'`
        );
        return null;
      }
    }
  }
}

async function exploreAPI(apiVersion, uniqueNames) {
  const apiUrl = `${BASE_URL}/${apiVersion}/autocomplete`;
  const queue = [...ENCODED_ALPHABET];
  const explored = new Set();
  const discoveredNames = new Set();
  let requestCount = 0;

  while (queue.length > 0) {
    const prefix = queue.shift();

    if (explored.has(prefix)) continue;
    explored.add(prefix);

    const result = await queryAPI(apiUrl, prefix);
    requestCount++;

    if (result && result.results) {
      const newNames = result.results;
      newNames.forEach((name) => {
        discoveredNames.add(name);
        uniqueNames.add(name); // Store globally unique names
      });

      console.log(
        `${apiVersion}: Found ${newNames.length} new names from '${prefix}'`
      );

      newNames.forEach((name) => {
        if (!explored.has(name)) queue.push(name);
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(
    `\n${apiVersion}: Extraction Complete. Total names found: ${discoveredNames.size}`
  );
  return { requestCount, totalNames: discoveredNames.size };
}

async function runExploration() {
  const resultsSummary = {};
  const uniqueNames = new Set();

  for (const version of API_VERSIONS) {
    console.log(`\nExtracting names from ${version}...`);
    resultsSummary[version] = await exploreAPI(version, uniqueNames);
  }

  console.log("\n--- Final Summary ---");
  for (const version in resultsSummary) {
    console.log(
      `${version.toUpperCase()} - Requests Made: ${
        resultsSummary[version].requestCount
      }, Results Found: ${resultsSummary[version].totalNames}`
    );
  }

  console.log("\n--- Unique Names Found ---");
  console.log([...uniqueNames]); // Print all unique names
}

runExploration();

const { validateInput, printResults } = require("./utils");
const { providers } = require("./searchEngines");

const resultObject = async (query, searchEngine, getResultCount) => ({
  query,
  searchEngine,
  nbrOfResults: await getResultCount(query),
});

const run = async () => {
  try {
    const queries = validateInput(process.argv);
    const pendingResults = [];

    queries.forEach((query) => {
      providers.forEach(async ({ name, getResultCount }) => {
        pendingResults.push(resultObject(query, name, getResultCount));
      });
    });

    const results = await Promise.all(pendingResults);
    printResults(results);
  } catch (err) {
    console.log(err.message);
  }
};

run();

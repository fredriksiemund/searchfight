const {
  validateAndFilterInput,
  processResponse,
  formatResult,
} = require("./utils");
const { providers } = require("./searchEngines");

const resultObject = async (query, searchEngine, getResultCount) => ({
  query,
  searchEngine,
  nbrOfResults: await getResultCount(query),
});

const run = async () => {
  try {
    const queries = validateAndFilterInput(process.argv);
    const pendingResponse = [];

    queries.forEach((query) => {
      providers.forEach(async ({ name, getResultCount }) => {
        pendingResponse.push(resultObject(query, name, getResultCount));
      });
    });

    const response = await Promise.all(pendingResponse);
    const result = processResponse(response);
    const output = formatResult(result);

    console.log(output);
  } catch (err) {
    console.log(err);
  }
};

run();

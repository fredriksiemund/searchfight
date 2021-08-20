const { providers } = require("./searchEngines");

const validateAndFilterInput = (args) => {
  if (args.length < 3) {
    throw new Error("Provide at least one argument");
  }
  return args.slice(2);
};

const resultObject = async (query, searchEngine, fetchResultCount) => ({
  query,
  searchEngine,
  nbrOfResults: await fetchResultCount(query),
});

const fetchResultCounts = (queries) => {
  const pendingResponse = [];

  queries.forEach((query) => {
    providers.forEach(({ name, fetchResultCount }) => {
      pendingResponse.push(resultObject(query, name, fetchResultCount));
    });
  });

  return Promise.all(pendingResponse);
};

const processResponse = (response) => {
  const results = {};

  response.forEach(({ query, searchEngine, nbrOfResults }) => {
    if (!results[searchEngine]) {
      results[searchEngine] = {
        data: { [query]: nbrOfResults },
        winner: query,
      };
    } else {
      let { data, winner } = results[searchEngine];
      data[query] = data[query] ? data[query] + nbrOfResults : nbrOfResults;
      results[searchEngine].winner =
        data[query] > data[winner] ? query : winner;
    }

    if (!results.total) {
      results.total = {
        data: { [query]: nbrOfResults },
        winner: query,
      };
    } else {
      let { data, winner } = results.total;
      data[query] = data[query] ? data[query] + nbrOfResults : nbrOfResults;
      results.total.winner = data[query] > data[winner] ? query : winner;
    }
  });

  return results;
};

const formatResult = (result) => {
  let searchEngineData = "";
  let searchEngineWinner = "";
  let totalWinner = "";

  Object.keys(result).forEach((key) => {
    if (key === "total") {
      totalWinner = `Total winner: ${result[key].winner}`;
    } else {
      const string = Object.keys(result[key].data)
        .map((query) => `${query}: ${result[key].data[query]}`)
        .join(" ");
      searchEngineData += `${key}: ${string}\n`;
      searchEngineWinner += `${key} winner: ${result[key].winner}\n`;
    }
  });

  return searchEngineData + searchEngineWinner + totalWinner;
};

const run = async (args) => {
  const queries = validateAndFilterInput(args);
  const response = await fetchResultCounts(queries);
  const result = processResponse(response);
  return formatResult(result);
};

module.exports = {
  fetchResultCounts,
  formatResult,
  processResponse,
  run,
  validateAndFilterInput,
};

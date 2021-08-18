const validateAndFilterInput = (args) => {
  if (args.length < 3) {
    throw new Error("Provide at least one argument");
  }
  return args.slice(2);
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

module.exports = { validateAndFilterInput, processResponse, formatResult };

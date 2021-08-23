const { providers } = require("./searchEngines");

/**
 * Checks so that at least one command line argument was provided by the user
 * @param   {string[]} args - The command line arguments
 * @throws  An error if size of args is less than 3
 * @returns {string[]} The input array but with the two first entries removed
 */
const validateAndFilterInput = (args) => {
  if (args.length < 3) {
    throw new Error("Provide at least one argument");
  }
  return args.slice(2);
};

/**
 * Fetches number of search results for each query in the input from each search engine supported in this application.
 * @param   {string[]} queries - Array of queries
 * @returns {Promise<{ query: string, searchEngine: string, nbrOfResults: number }>[]} Array of search results
 */
const fetchResultCounts = (queries) => {
  const pendingResponses = [];

  queries.forEach((query) => {
    providers.forEach(({ name, fetchResultCount }) => {
      const resultObject = async (query, searchEngine, fetchResultCount) => ({
        query,
        searchEngine,
        nbrOfResults: await fetchResultCount(query),
      });

      pendingResponses.push(resultObject(query, name, fetchResultCount));
    });
  });

  return Promise.all(pendingResponses);
};

/**
 * Finds the query with most search results for every search engine and for all search engines.
 * @param   {{query: string, searchEngine: string, nbrOfResults: number}[]} response - Array of search results
 * @returns {Object.<string, { data: Object<string, number>, winner: string }>} Object with the keys "total" and one
 * for every search engine
 */
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

/**
 * Creates an output string which is returned to the user.
 * @param   {Object.<string, { data: Object<string, number>, winner: string }} result
 * @returns {string} A nicely formatted string outputed to the user
 */
const formatResult = (result) => {
  let searchEngineData = "";
  let searchEngineWinner = "";
  let totalWinner = "";

  Object.keys(result).forEach((key) => {
    if (key === "total") {
      totalWinner = `Total winner: ${result[key].winner}`;
    } else {
      const capitalizedKey = key[0].toUpperCase() + key.slice(1);
      const string = Object.keys(result[key].data)
        .map((query) => `${query}: ${result[key].data[query]}`)
        .join(" ");
      searchEngineData += `${capitalizedKey}: ${string}\n`;
      searchEngineWinner += `${capitalizedKey} winner: ${result[key].winner}\n`;
    }
  });

  return searchEngineData + searchEngineWinner + totalWinner;
};

/**
 * Finds a winner among the queries provided by the user, for every search engine and in total
 * @param  {string[]} args - The command line arguments
 * @returns {Promise<string>}  A nicely formatted string outputed to the user
 */
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

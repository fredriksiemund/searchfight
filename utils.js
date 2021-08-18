const https = require("https");

exports.validateInput = (args) => {
  if (args.length < 3) {
    throw new Error("Provide at least one argument");
  }

  return args.slice(2);
};

exports.httpsGet = (url) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          resolve(JSON.parse(body));
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });

exports.printResults = (results) => {
  const seStrings = {};
  const seWinners = {};
  const queryResults = {};
  let queryWinner = null;

  results.forEach(({ query, searchEngine, nbrOfResults }) => {
    // Create result string for each search engine
    if (seStrings[searchEngine]) {
      seStrings[searchEngine] += ` ${query}: ${nbrOfResults}`;
    } else {
      seStrings[searchEngine] = `${searchEngine}: ${query}: ${nbrOfResults}`;
    }

    // Find query with most search results for each search engine
    if (seWinners[searchEngine]) {
      if (nbrOfResults > seWinners[searchEngine].nbrOfResults) {
        seWinners[searchEngine].query = query;
        seWinners[searchEngine].nbrOfResults = nbrOfResults;
      }
    } else {
      seWinners[searchEngine] = { query, nbrOfResults };
    }

    // Find query with most search results in all search engines
    if (queryResults[query]) {
      queryResults[query] += nbrOfResults;
    } else {
      queryResults[query] = nbrOfResults;
    }
    if (!queryWinner || queryResults[query] > queryResults[queryWinner]) {
      queryWinner = query;
    }
  });

  console.log(seStrings);
  console.log(seWinners);
  console.log(queryResults);
  console.log(queryWinner);
};

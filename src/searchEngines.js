const { httpsGet } = require("./https");

const GOOGLE_ID = "c6b510727951cad28";
const GOOGLE_KEY = "AIzaSyCGFeWdLAWZUHCGEvFISWVDpDGxrFRcTKg";

const BING_KEY = "a8c2252a3f754da39a49e34a22dd524c";

const providers = [
  {
    name: "google",
    fetchResultCount: async (query) => {
      const encodedQuery = encodeURIComponent(query);
      const request = {
        hostname: "www.googleapis.com",
        path: `/customsearch/v1?key=${GOOGLE_KEY}&cx=${GOOGLE_ID}&q=${encodedQuery}`,
      };
      const response = await httpsGet(request);
      return parseInt(response.searchInformation.totalResults);
    },
  },
  {
    name: "bing",
    fetchResultCount: async (query) => {
      const encodedQuery = encodeURIComponent(query);
      const request = {
        hostname: "api.bing.microsoft.com",
        path: `/v7.0/search?q=${encodedQuery}`,
        headers: { "Ocp-Apim-Subscription-Key": BING_KEY },
      };
      const response = await httpsGet(request);
      return response.webPages.totalEstimatedMatches;
    },
  },
];

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

module.exports = { providers, fetchResultCounts };

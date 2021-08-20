const { httpsGet } = require("./https");

const { BING_KEY, GOOGLE_KEY } = process.env;

/**
 * An array containing search engine providers supported in this application.
 * @type {{name: string, fetchResultCount: (query: string) => Promise<number>}[]} provider
 */
const providers = [
  {
    name: "google",
    fetchResultCount: async (query) => {
      const encodedQuery = encodeURIComponent(query);
      const GOOGLE_ID = "c6b510727951cad28";
      const req = {
        hostname: "www.googleapis.com",
        path: `/customsearch/v1?key=${GOOGLE_KEY}&cx=${GOOGLE_ID}&q=${encodedQuery}`,
      };
      const response = await httpsGet(req.hostname, req.path);
      return parseInt(response.searchInformation.totalResults);
    },
  },
  {
    name: "bing",
    fetchResultCount: async (query) => {
      const encodedQuery = encodeURIComponent(query);
      const req = {
        hostname: "api.bing.microsoft.com",
        path: `/v7.0/search?q=${encodedQuery}`,
        headers: { "Ocp-Apim-Subscription-Key": BING_KEY },
      };
      const response = await httpsGet(req.hostname, req.path, req.headers);
      return response.webPages.totalEstimatedMatches;
    },
  },
];

module.exports = { providers };

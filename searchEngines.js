const { httpsGet } = require("./network");

const GOOGLE_ID = "c6b510727951cad28";
const GOOGLE_KEY = "AIzaSyCGFeWdLAWZUHCGEvFISWVDpDGxrFRcTKg";

const BING_KEY = "a8c2252a3f754da39a49e34a22dd524c";

const getGoogleResultCount = async (query) => {
  const request = {
    hostname: "www.googleapis.com",
    path: `/customsearch/v1?key=${GOOGLE_KEY}&cx=${GOOGLE_ID}&q=${encodeURIComponent(
      query
    )}`,
  };
  const response = await httpsGet(request);
  return parseInt(response.searchInformation.totalResults);
  // return Math.floor(Math.random() * 101);
};

const getBingResultCount = async (query) => {
  const request = {
    hostname: "api.bing.microsoft.com",
    path: `/v7.0/search?q=${encodeURIComponent(query)}`,
    headers: { "Ocp-Apim-Subscription-Key": BING_KEY },
  };
  const response = await httpsGet(request);
  return response.webPages.totalEstimatedMatches;
  // return Math.floor(Math.random() * 101);
};

exports.providers = [
  {
    name: "Google",
    getResultCount: getGoogleResultCount,
  },
  {
    name: "Bing",
    getResultCount: getBingResultCount,
  },
];

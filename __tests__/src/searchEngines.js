const { providers, fetchResultCounts } = require("../../src/searchEngines");
const { httpsGet } = require("../../src/https");

jest.mock("../../src/https.js", () => ({
  httpsGet: jest.fn(),
}));

describe("searchEngines.js", () => {
  const genereateHttpsResponse = {
    google: (val) => ({ searchInformation: { totalResults: `${val}` } }),
    bing: (val) => ({ webPages: { totalEstimatedMatches: val } }),
  };

  providers.forEach(({ name, fetchResultCount }) => {
    describe(`testing fetchResultCount using ${name}`, () => {
      it("returns correct number of results", async () => {
        const expectedResponse = 230000;
        const httpsResponse = genereateHttpsResponse[name](expectedResponse);
        httpsGet.mockReturnValueOnce(Promise.resolve(httpsResponse));
        const response = await fetchResultCount(".net");
        expect(response).toEqual(expectedResponse);
      });

      it("throws an error if httpsGet fails", async () => {
        const expectedResponse = new Error("Failed");
        httpsGet.mockReturnValueOnce(Promise.reject(expectedResponse));
        try {
          await fetchResultCount(".net");
          fail("should throw an error");
        } catch (error) {
          expect(error).toEqual(expectedResponse);
        }
      });
    });
  });

  describe("testing fetchResultCounts", () => {
    it("returns output with the correct format", async () => {
      httpsGet.mockReturnValue({
        searchInformation: { totalResults: "44000000" },
        webPages: { totalEstimatedMatches: 37000000 },
      });

      const queries = [".net", "java", "go"];
      const expectedResult = [
        { query: ".net", searchEngine: "google", nbrOfResults: 44000000 },
        { query: "java", searchEngine: "google", nbrOfResults: 44000000 },
        { query: "go", searchEngine: "google", nbrOfResults: 44000000 },
        { query: ".net", searchEngine: "bing", nbrOfResults: 37000000 },
        { query: "java", searchEngine: "bing", nbrOfResults: 37000000 },
        { query: "go", searchEngine: "bing", nbrOfResults: 37000000 },
      ];

      const result = await fetchResultCounts(queries);
      expect(result).toEqual(expect.arrayContaining(expectedResult));
    });
  });
});

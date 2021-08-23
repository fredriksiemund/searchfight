const { providers } = require("../../src/searchEngines");
const { httpsGet } = require("../../src/https");

jest.mock("../../src/https.js", () => ({
  httpsGet: jest.fn(),
}));

// Helper functions to genereate the correct response from httpsGet
const genereateHttpsResponse = {
  google: (val) => ({ searchInformation: { totalResults: `${val}` } }),
  bing: (val) => ({ webPages: { totalEstimatedMatches: val } }),
};

describe("searchEngines.js", () => {
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
});

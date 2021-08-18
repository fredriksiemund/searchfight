const { run } = require("..");
const { httpsGet } = require("../src/https");

jest.mock("../src/https.js", () => ({
  httpsGet: jest.fn(),
}));

describe("index.js", () => {
  it("prints the correct result", async () => {
    httpsGet.mockReturnValue({
      searchInformation: { totalResults: "44000000" },
      webPages: { totalEstimatedMatches: 37000000 },
    });

    const expectedResult =
      "google: .net: 44000000 java: 44000000\n" +
      "bing: .net: 37000000 java: 37000000\n" +
      "google winner: .net\n" +
      "bing winner: .net\n" +
      "Total winner: .net";

    const result = await run(["node", "path", ".net", "java"]);
    expect(result).toEqual(expectedResult);
  });
});

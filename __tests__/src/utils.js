const {
  validateAndFilterInput,
  processResponse,
  formatResult,
} = require("../../src/utils");

describe("utils.js", () => {
  describe("testing vaildateAndFilterInput", () => {
    it("returns correct number of args", () => {
      const input = ["1", "2", "3"];
      expect(validateAndFilterInput(input)).toEqual(["3"]);
    });

    it("throws an error if not enough arguments are provided", () => {
      const input = ["1", "2"];
      const expectedResponse = new Error("Provide at least one argument");
      expect(() => validateAndFilterInput(input)).toThrow(expectedResponse);
    });
  });

  const rawData = [
    { query: ".net", searchEngine: "google", nbrOfResults: 100 },
    { query: "java", searchEngine: "google", nbrOfResults: 60 },
    { query: "go", searchEngine: "google", nbrOfResults: 8 },
    { query: ".net", searchEngine: "yahoo", nbrOfResults: 200 },
    { query: "java", searchEngine: "yahoo", nbrOfResults: 50 },
    { query: "go", searchEngine: "yahoo", nbrOfResults: 987 },
    { query: ".net", searchEngine: "bing", nbrOfResults: 30 },
    { query: "java", searchEngine: "bing", nbrOfResults: 40 },
    { query: "go", searchEngine: "bing", nbrOfResults: 7 },
  ];
  const processedData = {
    google: {
      data: { ".net": 100, java: 60, go: 8 },
      winner: ".net",
    },
    yahoo: {
      data: { ".net": 200, java: 50, go: 987 },
      winner: "go",
    },
    bing: {
      data: { ".net": 30, java: 40, go: 7 },
      winner: "java",
    },
    total: {
      data: { ".net": 330, java: 150, go: 1002 },
      winner: "go",
    },
  };
  const output =
    "google: .net: 100 java: 60 go: 8\n" +
    "yahoo: .net: 200 java: 50 go: 987\n" +
    "bing: .net: 30 java: 40 go: 7\n" +
    "google winner: .net\n" +
    "yahoo winner: go\n" +
    "bing winner: java\n" +
    "Total winner: go";

  describe("testing processResponse", () => {
    it("generates the correct data", () => {
      const result = processResponse(rawData);
      expect(result).toEqual(processedData);
    });
  });
  describe("testing formatResponse", () => {
    it("generates the correct output", () => {
      const result = formatResult(processedData);
      expect(result).toEqual(output);
    });
  });
});

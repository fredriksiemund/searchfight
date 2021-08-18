const { fetchResultCounts } = require("./src/searchEngines");
const {
  validateAndFilterInput,
  processResponse,
  formatResult,
} = require("./src/utils");

const run = async (args) => {
  const queries = validateAndFilterInput(args);
  const response = await fetchResultCounts(queries);
  const result = processResponse(response);
  return formatResult(result);
};

run(process.argv)
  .then((output) => {
    console.log(output);
  })
  .catch((error) => {
    if (!process.argv[1].includes("jest")) {
      console.log(error);
    }
  });

module.exports = { run };

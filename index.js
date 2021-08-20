// Must be placed at the top
require("./config/env").read();

const { run } = require("./src/main");

run(process.argv)
  .then((output) => {
    console.log(output);
  })
  .catch((error) => {
    console.log(error);
  });

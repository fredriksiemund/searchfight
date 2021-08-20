const fs = require("fs");
const path = require("path");

/**
 * Sets environment variables by reading them from a file. The filename is provided as an argument.
 * The file should contain one environment variable per line, formatted like this: nameOfVar=value
 * If no file is found, the application will exit.
 * @param  {string} [filename=.env] - Name of a file in the root folder. Defaults to ".env"
 */
const read = (filename = ".env") => {
  try {
    const content = fs.readFileSync(
      path.resolve(__dirname, `../${filename}`),
      "UTF-8"
    );
    const lines = content.split(/\r?\n/);
    lines.forEach((line) => {
      const [name, val] = line.split("=");
      process.env[name] = val;
    });
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

module.exports = { read };

const fs = require("fs");
const path = require("path");

const read = (filename = "../.env") => {
  try {
    const content = fs.readFileSync(path.resolve(__dirname, filename), "UTF-8");
    const lines = content.split(/\r?\n/);
    lines.forEach((line) => {
      const [name, val] = line.split("=");
      process.env[name] = val;
    });
  } catch (error) {
    if (!process.argv[1].includes("jest")) {
      console.log(error);
      process.exit();
    }
  }
};

module.exports = { read };

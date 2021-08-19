const fs = require("fs");
const path = require("path");

try {
  const content = fs.readFileSync(path.resolve(__dirname, ".env"), "UTF-8");
  const lines = content.split(/\r?\n/);
  lines.forEach((line) => {
    const [name, val] = line.split("=");
    process.env[name] = val;
  });
} catch (error) {
  console.log(error.message);
  process.exit();
}

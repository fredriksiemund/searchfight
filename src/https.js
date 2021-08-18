const https = require("https");

const httpsGet = (url) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          if (res.statusCode >= 300) {
            reject(new Error("Server responded with:\n" + body));
          } else {
            resolve(JSON.parse(body));
          }
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });

module.exports = { httpsGet };

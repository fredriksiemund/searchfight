const https = require("https");

/**
 * A wrapper for the built in htts.get() making it possible to use async/await
 * @param   {string} hostname - The base url
 * @param   {string} path - The url path
 * @param   {Object} [headers] - Optional header object
 * @throws  Throws an error if status code >= 300
 * @returns {Promise<Object>} Returns the http body as an Object
 */
const httpsGet = (hostname, path, headers = {}) =>
  new Promise((resolve, reject) => {
    https
      .get({ hostname, path, headers }, (res) => {
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

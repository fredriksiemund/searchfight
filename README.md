# Prerequisites

This program was created using Node.js v14.xx, if you don't have Node.js installed on your machine you can [download it here](https://nodejs.org/en/).

# Run the program

To be able to run the program, you first have to create a file for the environment variables used by the program. In the root directory of this project, create a file called `.env` and enter the following:

```
GOOGLE_KEY=secretKey
BING_KEY=secretKey
```

Replace secretKey with the correct value. Ask Fredrik about them.

To run the program, navigate to the root directory of this project in a terminal and type `node index.js` followed by one or more custom words, for example `node index .net java`. The program will search for these words on Google and Bing and return the number of results for each word on each search engine, which word has the most search results on each search engine and in total.

# Run the tests

To run the tests, navigate to the root directory of this project in a terminal and type `npm install`. This will install the test module required to run the tests. Once that is finished, type `npm test` to run the tests.

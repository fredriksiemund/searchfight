# Prerequisites

This program was created using Node.js v14.xx, if you don't have Node.js installed on your machine you can [download it here](https://nodejs.org/en/).

# Run the program

To be able to run the program, you first have to create a file for the environment variables used by the program. In the root directory of this project, create a file called `.env` and enter the following:

```
GOOGLE_KEY=secretKey
BING_KEY=secretKey
```

Replace secretKey with the correct value. Ask Fredrik about them. (Note: the free tiers of the APIs are being used. On Google, the number of searches is limited to 100 per day)

To run the program, navigate to the root directory of this project in a terminal and type `node index.js` followed by one or more custom words, for example `node index .net java`. The program will search for these words on Google and Bing and return 1) the number of results for each word on each search engine, 2) which word has the most search results on each search engine and 3) which word has the most search results on all search engines combined.

# Run the tests

To run the tests, navigate to the root directory of this project in a terminal and type `npm install`. This will install the test module required to run the tests. Once that is finished, type `npm test` to run the tests.

# Add a new search engine

It is very easy to add support for a new search engine to the application. In [searchEngines.js](src/searchEngines.js), just add a new object to the array `providers` with the following types:

```
{
  name: string
  fetchResultCount: (query: string) => Promise<number>
}
```

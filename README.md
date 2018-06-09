# URL Shortener

This is a url shortener that generates a short url for a given logn url and also redirects the short url to the corresponding long url.

## Requirements

- Node.js (only tested with v8.11.2)
- npm

## How to use

* Open command line on Windows or console in Linux and position yourself in the folder of this URL Shortener
* Run `npm install`
* Then type `node app.js` (Now, the server is working)
* Go to localhost:3000:
  - To get a short url, put a long url in the first input field and press enter (you will get a json with the short and the long url)
  - To get the long url that corresponds to a short url, write the short one in the second input field (you will get again a json with the short and the long url)
* To see the magic happenning, try it in your browser! Go to a short link that you obtained from the previous step and see that you will get the original page (the one that belongs to the long url)

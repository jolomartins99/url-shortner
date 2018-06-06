const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const httpStatus = require('http-status-codes');

const port = 3000;
const host = "localhost:"+port+"/";

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
//const alphabet = 'abcdfghjkmnpqrstvwxyzABCDFGHJKLMNPQRSTVWXYZ123456789';
const lenAlphabet = alphabet.length;

var db = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(request, response) {
    response.set('Content-Type', 'text/html');
    response.sendFile(path.join(__dirname + '/index.html'));
});

/**
 * post has to be made with a field:
 *    - url (original url)
 */
app.post('/get_short', function(request, response) {
    let originalUrl = request.body.url;
    db.push(originalUrl);
    let num = db.length;

    let digits = [];
    let shortUrl = host;

    while (num > 0) {
        let remainder = num % lenAlphabet;
        digits.push(remainder);
        num = Math.floor(num / lenAlphabet);
        shortUrl += alphabet[remainder-1];
    }

    sendJsonResponse(response, httpStatus.CREATED, {
        'shortURL': shortUrl,
        'originalURL': originalUrl,
    });
});

/**
 * post has to be made with a field:
 *    - url (short url)
 */
app.post('/get_original', function(request, response) {
    let shortUrl = request.body.url;
    let pathUrl = checkShortUrl(shortUrl);

    if (pathUrl) {
        if (originalUrl = getOriginalUrl(pathUrl)) {
            sendJsonResponse(response, httpStatus.OK, {
                'shortURL': shortUrl,
                'originalURL': originalUrl,
            });
        } else {
            sendJsonResponse(response, httpStatus.NO_CONTENT, {
                'error': 'This url doesn\'t exist',
            });
        }
    } else {
        sendJsonResponse(response, httpStatus.BAD_REQUEST, {
            'error': 'This request is invalid. Please check your url again.',
        });
    }
});

app.get('/:path', function(request, response) {
    if (originalUrl = getOriginalUrl(request.params.path)) {
        response.writeHead(307, {Location: "//"+originalUrl});
        response.end();
    } else {
        response.setHeader('Content-Type', 'text/plain');
        response.status(httpStatus.BAD_REQUEST);
        response.send("Something went wrong, please check the url.");
    }
});

app.listen(port, () => console.log('Server running at http://127.0.0.1:'+port+'/'));

function checkShortUrl(shortUrl) {
    let regex = new RegExp('^(?:https?:\/\/|)(?:[w]{3}\.)?(?:'+host+')((?:(?!\/).)+$)');
    let pathUrl = null;

    // it means that is a valid url
    if ((match = regex.exec(shortUrl)) !== null) {
        // pathUrl will be an array of characters
        pathUrl = match[1].split('');
    }

    return pathUrl;
}

function getOriginalUrl(pathUrl) {
    let originalUrl = null;
    // id will be, after the for loop, the id of the url that be stored in the db
    let id = 0;

    for (let i = 0, size = pathUrl.length, j = size-1; i < size; i++, j--) {
        id += alphabet.indexOf(pathUrl[i]) * (lenAlphabet ** j);
    }

    if (id < db.length) originalUrl = db[id];

    return originalUrl;
}

function sendJsonResponse(response, httpStatusCode, json) {
    response.setHeader('Content-Type', 'application/json');
    response.status(httpStatusCode);
    response.send(JSON.stringify(json));
}

var http = require('http');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const { resolve } = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(cors());

let rawApiKeys = fs.readFileSync('apikeys.json');
let apiKeys = JSON.parse(rawApiKeys);
let googleBooksApiKey = apiKeys.googlebooks;

app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    res.write('<html><body><p>This is the Home Page.</p></body></html>');
    res.end();
});

app.post('/book', async (req, res) => {
    var body = req.body;
    console.log(body);
    var query = requestBook(body.title, body.author);
    await getBook('https://www.googleapis.com/books/v1/volumes?' + query + '&key=' + googleBooksApiKey).then((book) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(book));
    });
    res.end()
});

app.use((req, res, next) => {
    res.status(404).send("Sorry, that route doesn't exist");
});

app.listen(5000, () => {
    console.log('Listening on port 5000');
});

function requestBook(title, author) {
    var urlTitle = 'intitle:' + title.replace(/ /g, '+');
    var urlAuthor = 'inauthor:' + author.replace(/ /g, '+');

    var queryString = 'q=' + urlTitle + '+' + urlAuthor;
    return queryString;
}

async function getBook(url) {
    return new Promise(function(resolve, reject) {

        axios.get(url).then((response) => {
            var book = response.data.items[0].volumeInfo;
            resolve(book);
        }).catch((e) => {
            console.log(e);
            reject(e);
        });
    })
}
var http = require('http');
const axios = require('axios');
const fs = require('fs');
const { resolve } = require('path');
let rawApiKeys = fs.readFileSync('apikeys.json');
let apiKeys = JSON.parse(rawApiKeys);
let googleBooksApiKey = apiKeys.googlebooks;

var server = http.createServer(function (req, res) {
    if (req.url == '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });

        res.write('<html><body><p>This is the Home Page.</p></body></html>');
        res.end();
    } else if (req.url == '/book') {
        return new Promise(function(resolve, reject) {
            var query = requestBook('Harry Potter', 'J K Rowling');
            var book = {};

            axios.get('https://www.googleapis.com/books/v1/volumes?' + query + '&key=' + googleBooksApiKey).then((response) => {
                var book = response.data.items[0].volumeInfo;
                console.log(book);
                console.log(book.title);
                console.log(book.description);
                // res.writeHead(200, { 'Content-Type': 'text/html' });

                // res.write('<html><body><p>' + book.title + '</p></body></html>');
                // res.write('<html><body><p>' + book.description + '</p></body></html>');
                // res.end();
                resolve(book);
            }).catch((e) => {
                console.log(e);
            });
        })
    } else {
        res.end('Invalid Request!');
    }
});
server.listen(5000);
console.log('Node.Js web server at port 5000 is running...');

function requestBook(title, author) {
    var urlTitle = 'intitle:' + title.replace(/ /g, '+');
    var urlAuthor = 'inauthor:' + author.replace(/ /g, '+');
    console.log(urlTitle);
    console.log(urlAuthor);

    var queryString = 'q=' + urlTitle + '+' + urlAuthor;
    return queryString;
}
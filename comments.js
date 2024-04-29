// Create web server
// 1. Load the http module
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var querystring = require('querystring');

// 2. Create a http server
http.createServer(function (request, response) {
    // Parse the request containing file name
    var pathname = url.parse(request.url).pathname;
    var query = url.parse(request.url).query;
    var queryObj = querystring.parse(query);
    console.log("Request for " + pathname + " received.");
    if (pathname == "/comments") {
        if (request.method == 'POST') {
            var postData = '';
            request.on('data', function (chunk) {
                postData += chunk;
            });
            request.on('end', function () {
                response.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                response.end(postData);
            });
        } else if (request.method == 'GET') {
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });
            var comments = [{
                "author": "Pete Hunt",
                "text": "This is one comment"
            }, {
                "author": "Jordan Walke",
                "text": "This is *another* comment"
            }];
            response.end(JSON.stringify(comments));
        }
    } else {
        // Read the requested file content from file system
        fs.readFile(pathname.substr(1), function (err, data) {
            if (err) {
                console.log(err);
                // HTTP Status: 404 : NOT FOUND
                // Content Type: text/plain
                response.writeHead(404, {
                    'Content-Type': 'text/html'
                });
            } else {
                // Page found
                // HTTP Status: 200 : OK
                // Content Type: text/plain
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                // Write the content of the file to response body
                response.write(data.toString());
            }
            // Send the response body
            response.end();
        });
    }
}).listen(8081);

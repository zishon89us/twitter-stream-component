/**
 * Created by Zeeshan Hassan on 8/20/14.
 */

var http = require('http'),
    fs = require('fs'),
    comp = require('./component'),
    twitter = require('ntwitter'),
    filter = process.argv[2] || 'Java',
    fileName = process.argv[3],
    lineSeparator = function () {
        console.log(' -- ')
    };


/* method to generate stream json file if required */
/*var addStreamFile = function (data) {
    if (data.text) {
        fs.appendFile(fileName + '.json', JSON.stringify(data) + '\n', function (err) {
            if (err)
                console.log("error while saving file " + err);
        });
    }
}*/



/* Ctrl+c to stop streaming */
process.on('SIGINT', function () {
    lineSeparator();
    console.log("Streaming Stopped...");
    process.exit();
});

process.on('uncaughtException', function (err) {
    lineSeparator();
    console.log("Caught exception...");
    lineSeparator();
    console.log("Check your keys");
    process.exit();
});


/* create stream object and pass keyword, since here we have captured search-keyword from argv */
var stream = new comp(filter);

stream.init(filter);

stream.on('tweet', function(data) {
    console.log(data.text);
});




require('socket.io').listen(http.createServer(function (req, res, next) {

        fs.readFile(__dirname + '/stream.html',
            function (err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error while loading. Try Again !');
                }
                res.writeHead(200);
                res.end(data);
            });

    }).listen(3000)).sockets.on('connection', function(socket) {

        stream.on('tweet', function(data) {
            socket.emit('twitter',data);
        });

    });



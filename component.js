/**
 * Created by Zeeshan Hassan on 8/20/14.
 */

var events = require('events'),
    twitter = require('ntwitter');

function Stream(filter) {
    this.filter = filter;
    this.keyword = filter;
    this.twit = new twitter({
        consumer_key: 'App_Consumer_key',  // looks like v4BL8HoIdkBxNPxxxxxxxxxxxx
        consumer_secret: 'App_Consumer_Secret', // looks like sKkdIrjVBM1JqbKsQXIPBKIAavsjc5xxxxxxxxxxxxxxxxx
        access_token_key: 'User_Access_Token_Key', // looks like 893336886-sheCML0pFUHhHBYQIacxxxxxxxxxxxxxxxxxx
        access_token_secret: 'User_Access_Token_Secret' // looks like O3nEn8tegjXJSoZNlEKBYGCPnxxxxxxxx
    });

    events.EventEmitter.call(this);

    this.tweet  = function(data) {
        this.emit('tweet', data);
    }

    this.stop  = function() {
        console.log("Stopping now...");
        process.exit();
    }

    this.init = function(filter){
        var that = this;
        console.log('init called ' + that.filter);
        this.twit.stream('statuses/filter', {'track': that.filter},
            function (stream) {
                console.log('streaming for ... ' + that.filter);
                stream.on('data', function (data) {
                    that.tweet(data);
                });
            });
    }
}

Stream.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = Stream;

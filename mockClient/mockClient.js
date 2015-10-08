var R = require('ramda');
var timeplan = require('timeplan');
var Chance  = require('chance')
var chance = new Chance();
var io = require('socket.io-client');
var argv   = require('minimist')(process.argv.slice(2));

chance.mixin({
    'lead': function() {
        return {
            name: chance.name(),
            email: chance.email(),
            comment: chance.sentence()
        };
    }
});

var socketRequests = function() {
    var socket = io.connect('http://0.0.0.0:8080');
    socket.on('connect', function () {
        console.log("socket connected");
    });
    timeplan.repeat({
        period: "10s",
        task: function () {
            var randomJSON = chance.lead();
            socket.emit('incomingLead', randomJSON);
            console.log("Random Data Sent   :  ", randomJSON);
        }
    });
}

var jsonRequests = function() {
    timeplan.repeat({
        period: "10s",
        task: function () {
            var request = require('request');

            var throttledRequest = require('throttled-request')(request)
            throttledRequest.configure({
                requests: 2,
                milliseconds: 5000
            });

            console.log("Every 10 Seconds");
            var randomJSON = chance.lead();

            var options = {
                uri: 'http://0.0.0.0:8080/lead',
                method: 'POST',
                json: randomJSON
            };

            throttledRequest(options, function (error, response, body) {
                var result = !error && response.statusCode == 200 ? body : error;
                console.log("Random Data Sent   :  ", randomJSON);
                console.log("Server Body        :  ", body);
                console.log("Server Error       :  ", error);
                if (!error) {
                    console.log("Server Status Code :  ", response.statusCode);
                }
            });
        }
    });
}

var controller = R.cond([
    [R.has('r'), jsonRequests],
    [R.has('l'), socketRequests],
    [R.T, socketRequests]
]);

controller(argv);
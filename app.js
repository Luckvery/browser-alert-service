var path       = require('path');
var express    = require('express');
var app        = express();
var server     = require('http').Server(app);
var io         = require('socket.io')(server);
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

server.listen(8080, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('Running browser-alert-service app at http://%s:%s', host, port);
});

app.get('/', function (req, res) {
    console.log("all righty then")
    res.sendFile(__dirname + '//public/index.html');
});

app.post('/lead', function (req, res) {
    console.log("Lead came in!!!")
    console.log("request",req.body);
    io.emit('leads', req.body);
});

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('incomingLead', function (data) {
        console.log("Incomming Lead!!!\n", data);
        io.emit('leads', data);
    });
});


// Mock Client
var exec = require('child_process').exec;
exec('node mockClient/mockClient.js', function(error, stdout, stderr) {
    console.log('stdout: ', stdout);
    console.log('stderr: ', stderr);
    if (error !== null) {
        console.log('exec error: ', error);
    }
});
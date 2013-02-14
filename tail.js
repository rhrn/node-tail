var filename = process.argv[2];

var spawn = require('child_process').spawn,
  tail = spawn('tail', ['-f', filename]);

var app = require('http').createServer(function(req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
});

var io = require('socket.io').listen(app),
  fs = require('fs');

app.listen(3000);

io.set('log level', 1);

io.sockets.on('connection', function (socket) {

  tail.stdout.on("data", function (data) {
	  socket.emit('log', data.toString("utf8"));
  }); 

});

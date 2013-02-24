
var express = require('express')
  , gzippo = require('gzippo')
  , path 	 = require('path')
  , app  = express.createServer()
  , io = require('socket.io').listen(app)
  , ping = require('./lib/ping')
  , db = require('./lib/db');


app.configure(function() {
  app.set('views', __dirname + "/views");
  app.set('view engine', 'ejs');
  app.register('.html', require('ejs'));
  app.use(gzippo.staticGzip(path.join(__dirname, '/public')));

  io.set('log level',1);

  db.connect(function() {
    ping.init();
  });
});

app.get('/', function(req,res) {
  res.render('index.html', {
    services: ping.urls
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('listening on',port);
});

io.sockets.on('connection', function(socket) {
  ping.ping();

  setInterval(function() {
  ping.ping();
  }, 15000);

  ping.serviceEvents.on('pingResults', function(data){
    socket.emit('update:service', data);
    db.addPing(data, function(err,res) {
      if (err) throw (err);
    });
  });

   socket.on('add:service', function(data) {
    db.addService(data, function(err,res) {

      if (err) console.log('err');

      ping.init(function() {
        var toReturn = ping.urls[ping.urls.length - 1];
        socket.emit('confirm:service', toReturn);
      });
    });
  });

  ping.serviceEvents.on('serviceResults', function(data){
    socket.emit('new:service', data);
  });  
});


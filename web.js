
var express = require('express')
  , gzippo = require('gzippo')
  , path 	 = require('path')
  , app  = express.createServer()
	, io = require('socket.io').listen(app)
	, ping = require('./lib/ping.js');

app.configure(function() {
  app.set('views', __dirname + "/views");
  app.set('view engine', 'ejs');
  app.register('.html', require('ejs'));
  app.use(gzippo.staticGzip(path.join(__dirname, '/public')));
});

app.get('/', function(req,res) {
  res.render('index.html');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('listening on',port);
});

io.sockets.on('connection', function(socket) {
  socket.emit('evt', { hello: 'world' });
  socket.on('cli', function(data) {
    console.log('data',data);
  });
});

setTimeout(ping.ping, 100);
ping.serviceEvents.on('serviceConnect', function(){
  console.log('Service is UP!');
});

ping.serviceEvents.on('serviceDisconnect', function(error, response){
  if(!error){
    console.log('Service is down! Error:', response.statusCode);
  }
  else{
    console.log('Service is down!');
  }
});

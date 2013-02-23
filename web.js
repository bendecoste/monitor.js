
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

  db.connect(function() {
    ping.init();
  });
});

app.get('/', function(req,res) {
  res.render('index.html');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('listening on',port);
});

io.sockets.on('connection', function(socket) {
  setInterval(function() {
    ping.ping();
  }, 5000);

  ping.serviceEvents.on('pingResults', function(data){
    socket.emit('new:ping', data);
    db.addPing(data, function(err,res) {
      console.log('DONE!');
      if (err) throw (err);
    });
  });

   socket.on('add:service', function(data) {
     console.log('adddddd');
    db.addService(data, function(err,res) {

      if (err) console.log('err');

      console.log('get served');
      db.getServices();

      console.log('res',res);

      // TODO: format
      socket.emit('confirm:service',data);
    });
  });

  ping.serviceEvents.on('serviceResults', function(data){
    socket.emit('new:service', data);
  });  
});


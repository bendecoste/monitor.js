var express = require('express');

var app = express.createServer();
var io = require('socket.io').listen(app);

app.configure(function() {
  app.set('views', __dirname + "/views");
  app.set('view engine', 'ejs');
  app.use('/css', express.static(__dirname + '/public/css'));
  app.use('/js', express.static(__dirname + '/public/js'));
  app.use('/img', express.static(__dirname + '/public/img'));

  app.register('.html', require('ejs'));
 
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

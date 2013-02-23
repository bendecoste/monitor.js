var express = require('express');
var app = express();

app.configure(function() {
  app.engine('.html', require('ejs').renderFile);
  app.use('/public', express.static(__dirname + '/public'));
  app.use('/css', express.static(__dirname + '/public/css'));
  app.use('/js', express.static(__dirname + '/public/js'));
  app.use('/img', express.static(__dirname + '/public/img'));
});

app.get('/', function(req,res) {
  console.log('rendering');
  res.render('index.html');
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('listening on',port);
});

var express = require('express');
var app = express();

app.configure(function() {
  app.engine('.html', require('ejs').renderFile);
});

app.get('/', function(req,res) {
  console.log('rendering');
  res.render('index.html');
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('listening on',port);
});

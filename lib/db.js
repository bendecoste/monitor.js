var db = exports;
module.constructor = function ping(){};
var pg = require('pg');

db.connect = function(conString){
  var client = new pg.Client(conString);
  client.connect(function(err){
    // probably need some error handling
    console.log(err);
  });
}

db.disconnect = function(client){
  client.end();
}

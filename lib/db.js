var db = exports;
module.constructor = function ping(){};
var pg = require('pg');

var client;

db.connect = function(){
  var conString = process.env.DATABSE_URL || "tcp://postgres:5432@localhost/monitor";
  client = new pg.Client(conString);
  client.connect(function(err){
    // probably need some error handling
    console.log(err);
  });
};

db.disconnect = function(client){
  client.end();
};

db.addService = function(data,cb) {
  console.log('DATATATATA', client);
  var q = "INSERT INTO services (name, url) values ($1, $2)";
  _query(q, [data['service-name'], data['service-location']]);
};

db.removeService = function(id,cb) {
};

function _query(q,param,cb) {
  client.query(q,param,function() {
    console.log('INSERTED!!!!!!!!', arguments);
  });
}


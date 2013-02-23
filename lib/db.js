var db = exports;
module.constructor = function ping(){};
var pg = require('pg');

var client;

db.connect = function(cb){
  var conString = process.env.DATABASE_URL || "tcp://postgres:5432@localhost/monitor";
  client = new pg.Client(conString);
  client.connect(function(err){
    // probably need some error handling
    console.log(err);
    cb();
  });
};

db.disconnect = function(client){
  client.end();
};

db.addService = function(data,cb) {
  var q = "INSERT INTO services (name, url) values ($1, $2)";
  _query(q, [data['service-name'], data['service-location']],cb);
};

db.removeService = function(id,cb) {
};

function _query(q,param,cb) {
  client.query(q,param,cb);
}

db.addPing = function(data,cb){
  var q = "INSERT INTO pings (s_id, time, status) values ($1, $2, $3)";
  _query(q, [data.s_id, data.time, data.sc]);
};

db.getServices = function(cb){
  var query = client.query("SELECT * FROM services", cb);
};


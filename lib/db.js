var db = exports;
module.constructor = function ping(){};
var pg = require('pg');
var ping = require('./ping');

var client;
var services;

db.connect = function(){
  var conString = process.env.DATABASE_URL || "tcp://postgres:5432@localhost/monitor";
  console.log('constringngngng', process.env);
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

db.addPing = function(data){
  console.log('data', data);
  var q = "INSERT INTO pings (name, ping_time) values ($1, $2)";
  _query(q, [data.url, data.time]);
};

db.getServices = function(){
  var query = client.query("SELECT * FROM services", function(err, result){
    console.log(err);
  });
  
  query.on('row', function(row){
    services.concat(row);     
  });
  
  query.on('end', function(result){
    ping.serviceEvents.emit("serviceResults", services);    
  });
};

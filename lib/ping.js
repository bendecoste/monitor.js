var ping = exports; 
module.constructor = function ping(){};
var request = require('request');
var ee = require('events').EventEmitter;
var db = require('./db');
ping.serviceEvents = new ee();

var _ = require('underscore');


var urls = [];

ping.init = function(cb) {
  urls = [];
  db.getServices(function(err,res) {
    if (err) throw (err);
    _.each(res.rows, function(data) {
      urls.push(data);
    });

    if (cb) cb();
  });
};

ping.ping = function(){
  urls.forEach(function(url) {
    makeRequest(url);
  });
};

function makeRequest(data) {
  var start = Date.now();

  var uri = data.url;
  if (data.url.indexOf('http') === -1) {
    uri = 'http://' + data.url;
  }

  console.log('REQUESTING',uri);
  request({
    uri: uri,
    method: 'HEAD'
  }, function(error, response, body) {
    if (error) console.log('REQUEST ERROR:',error);
    else console.log('GOODJOB',uri);
    var finish = Date.now();
    var time = finish - start;

    var results = {};

    if (error) {
      results.sc = 404;
    } else {
      results.sc = response.statusCode;
    }

    results.time = time;
    results.url = data.url;
    results.s_id = data.id;
    results.name = data.name;

    ping.serviceEvents.emit("pingResults", results);
  });
}

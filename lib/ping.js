var ping = exports; 
module.constructor = function ping(){};
var request = require('request');
var ee = require('events').EventEmitter;
ping.serviceEvents = new ee();

ping.ping = function(){
  var urls = ["http://google.com", "http://github.com", "https://github.com/donohoe/request-js/demo/", "http://haha.gogo.net"];


  urls.forEach(function(url) {
    makeRequest(url);
  });
};

function makeRequest(url) {
  var start = Date.now();
  request({
    uri: url,
    method: 'HEAD'
  }, function(error, response, body) {
    var finish = Date.now();
    var time = finish - start;

    var data = {};

    if (error) {
      data.sc = 404;
    } else {
      data.sc = response.statusCode;
    }

    data.time = time;
    data.url = url;

    ping.serviceEvents.emit("pingResults", data);
  });
}

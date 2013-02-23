var ping = exports; 
module.constructor = function ping(){};
var request = require('request');
var ee = require('events').EventEmitter
ping.serviceEvents = new ee();

ping.ping = function(){
  var urls = ["http://google.com", "http://github.com", "http://haha.gogo",
               "https://github.com/donohoe/request-js/demo/"];

  for(var i = 0; i < urls.length; i++){
    request(urls[i], function(error, response, body) {
      if(!error && response.statusCode == 200){
        ping.serviceEvents.emit('serviceConnect');
      }
      else{
        ping.serviceEvents.emit('serviceDisconnect', error, response);
      }
    });
  }
}

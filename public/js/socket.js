var socket = io.connect('http://localhost:5000');
socket.on('new:ping', function(data) {
  console.log('data',data);
});

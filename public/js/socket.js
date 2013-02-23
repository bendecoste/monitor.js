var socket = io.connect('http://localhost:5000');
socket.on('evt', function(data) {
  console.log('data',data);
  socket.emit('data', { i: 'suck' });
});

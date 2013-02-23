var socket = io.connect('http://ninja:5000');
socket.on('evt', function(data) {
  console.log('data',data);
  socket.emit('data', { i: 'suck' });
});

App = (function($){

	var el = {};

	function init(){

		_bindElements();
		_bindEvents();
	}

	function _bindElements(){
		el.service_modal= $('#add-service-modal');
		el.service_form = el.service_modal.find('form');
	}

	function _bindEvents(){
		el.service_form.on('submit', _formHandler);
	}

	function _formHandler(evt){
		var form_data = el.service_form.serializeObject();
		el.service_modal.modal('toggle');
		el.service_form.find('input').val('');
		console.log(form_data);
		socket.emit('add:service', form_data);
		evt.preventDefault();
	}
	
	return {
		init : init
	}

})(jQuery);

$(document).on('ready', App.init());
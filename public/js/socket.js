var socket = io.connect('http://localhost:5000');
socket.on('new:ping', function(data) {
  console.log('data',data);
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

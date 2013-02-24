// var socket = io.connect('http://ancient-spire-1353.herokuapp.com/');
var socket = io.connect('http://ninja:5000');
socket.on('new:ping', function(data) {
});

var Service = Backbone.Model.extend({
	defaults: {
	    updown  : 'Pending',
	    name    : '',
	    url     : '',
	    latency : 'Pending',
	    status  : 'Pending'
	}
});

App = (function($) {

	var el   = {};
	var tmpl =  Handlebars.compile($("#service-row-template").html());

	function init() {
		_bindElements();
		_bindEvents();
		_serviceConfirmed();
	}

	function _bindElements() {
		el.service_modal = $('#add-service-modal');
		el.service_form  = el.service_modal.find('form');
		el.service_table = $('#service-table tbody');
	}

	function _bindEvents() {
		// Dom Events
		el.service_form.on('submit', _formHandler);
		el.service_table.on('click', '.remove-service', _removeService);

		// Socket Events
		socket.on('confirm:service', _serviceConfirmed);
		socket.on('update:service', _serviceUpdate);
  	}

  	function _removeService(ev) {
  		var el = $(this).parents('tr');
  		var id = el.attr('id').split('-')[1];
  		el.remove();

  		socket.emit('remove:service', { id: id });

  		ev.preventDefault();
  	}
	

	function _formHandler(evt) {
		var form_data = el.service_form.serializeObject();
		el.service_modal.modal('toggle');
		el.service_form.find('input').val('');
		console.log(form_data);
		socket.emit('add:service', form_data);
		evt.preventDefault();
	}

	function _serviceConfirmed(data) {
		data = {
			id:  6,
			name: 'blah'
		}
    	if (!data) return;

		service = new Service(data);
		row_html = tmpl(service.toJSON());
		el.service_table.append(row_html);
	}

	function _serviceUpdate(data) {
    	console.log('hit me with some daytay',data);
		var service_row = el.service_table.find('#service-' + data.s_id);
    	var updown = data.sc == 200 ? "Ok" : "Down";
		service_row.find('.updown span').text(updown);
		service_row.find('.service_name a').text(data.name);
		service_row.find('.service_name a').attr('href', data.url);
		service_row.find('.latency').text(data.time + 'ms');
		service_row.find('.status span').text(data.sc);
	}
	
	return {
		init : init
	};

})(jQuery);

$(App.init());

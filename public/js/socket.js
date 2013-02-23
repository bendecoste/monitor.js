var socket = io.connect('http://ancient-spire-1353.herokuapp.com/');
// var socket = io.connect('http://localhost:5000');
socket.on('new:ping', function(data) {
  console.log('data',data);
});

var Service = Backbone.Model.extend({
	defaults: {
	    updown: 'Pending',
	    service_name: '',
	    service_location: '',
	    latency: 'Pending',
	    status: 'Pending'
	},
	initialize: function(){
	    console.log('new service what?')
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
		el.service_form.on('submit', _formHandler);
		socket.on('confirm:service', _serviceConfirmed);
		socket.on('update:service', _serviceUpdate);
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
		data = 'blah' || data

		console.log(data)

		var context = {
			id: 45,
			service_name: "Sweet Service",
			service_location: "http://google.ca",
		}

		service = new Service(context);
		row_html = tmpl(service.toJSON());
		el.service_table.append(row_html);
	}

	function _serviceUpdate(data) {
		data = data || 45;
		var service_row = el.service_table.find('#service-' + data.id);

		service_row.find('.updown span').text(data.updown);
		service_row.find('.service_name a').text(data.service_name);
		service_row.find('.service_name a').attr('href', data.service_location);
		service_row.find('.latency').text(data.latency + 'ms');
		service_row.find('.status span').text(data.status);
	}
	
	return {
		init : init
	};

})(jQuery);

$(App.init());

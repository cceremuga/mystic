var map;
var lastOpened;
var rtime;
var timeout = false;
var delta = 200;
var markersDisplayed = [];
var lastLatLng = { };

// Centers the map.
function centerOnPoint(latitude, longitude) {
	var updatedLatLng = new google.maps.LatLng({ 
		lat: latitude, 
		lng: longitude
	});

	map.setCenter(updatedLatLng);
}

function highlightMessage(marker) {
	highlightMessageById('msg-' + marker.title);

	var latLng = marker.getPosition();
	map.setCenter(latLng);
}

function highlightMessageById(id) {
	// Change highlight.
	$('.m-posts article').removeClass('slds-theme--alt-inverse');
	$('#' + id).addClass('slds-theme--alt-inverse');

	showInfoWindowAtMarkerForId(id, buildInfoWindowForId(id));
}

function showInfoWindowAtMarkerForId(id, infoWindow) {
	if (typeof lastOpened !== 'undefined' && lastOpened !== null) {
		lastOpened.close();
	}

	$.each(markersDisplayed, function(index, item) {
		if ('msg-' + item.title === id) {
			infoWindow.open(map, item);
			lastOpened = infoWindow;
		}
	});
}

function buildInfoWindowForId(id) {
	var messageElement = $('#' + id);

	var infoWindow = new google.maps.InfoWindow({
      content: '<strong>' + messageElement.data('username') + '</strong> ' + messageElement.data('timestamp')
    });

    return infoWindow;
}

function addMessageToMap(pos, title) {
	// Pokeball icon.
	var markerImage = '/images/pokeball.png';

	// Build marker.
    var marker = new google.maps.Marker({       
        position: pos, 
        map: map,
        icon: markerImage,
        title: title
    }); 

    // Add click listener.
    google.maps.event.addListener(marker, 'click', function() { 
       highlightMessage(marker);
    });

    // Throw it into the list of all markers.
    markersDisplayed.push(marker);
}

function addMessagesToMap(data) {
	// Adds all messages in the page as map markers with a Pokeball.
	$.each(data, function(index, item) {
		// Latitude / longitude object.
		var markerLatLng = new google.maps.LatLng({ 
			lat: item.location.x, 
			lng: item.location.y
		});

		addMessageToMap(markerLatLng, item.id.toString());
	});
}

// Initializes the map w/ geolocation.
function initMap() {
	var spinner = $('#m-spinner');
	spinner.show();

	// Build the map.
	map = new google.maps.Map(document.getElementById('posts-by-location'), {
		center: { lat: 41.850033, lng: -87.6500523 },
		zoom: 4,
		streetViewControl: false,
		mapTypeControl: false,
		styles: [{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#1c99ed"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#1f79b5"}]},{"featureType":"administrative.province","elementType":"labels.text.fill","stylers":[{"color":"#6d6d6d"},{"visibility":"on"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#555555"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#999999"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.government","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#e1eddd"}]},{"featureType":"poi.place_of_worship","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"},{"lightness":"45"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ff9500"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"on"},{"hue":"#009aff"},{"saturation":"100"},{"lightness":"5"}]},{"featureType":"road.highway.controlled_access","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#ff9500"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway.controlled_access","elementType":"labels.icon","stylers":[{"lightness":"1"},{"saturation":"100"},{"hue":"#009aff"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#8a8a8a"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"lightness":"33"},{"saturation":"-100"},{"visibility":"on"}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#4db4f8"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]}]
	});

	// Geolocate.
	navigator.geolocation.getCurrentPosition(function(position) {
	    // Center.
	    centerOnPoint(position.coords.latitude, position.coords.longitude);

	    // Set for haversine AJAX request.
	    lastLatLng = {
	    	latitude: position.coords.latitude,
	    	longitude: position.coords.longitude
	    };

	    // Add circle of 5 mile radius.
		var circleCenter = new google.maps.LatLng({ 
			lat: position.coords.latitude, 
			lng: position.coords.longitude
		});

		var circle = new google.maps.Circle({
		    map: map,
		    radius: 8046.72,  // 5 miles in meters
		    strokeColor: '#7F8DE1',
		    strokeWeight: 4,
		    fillOpacity: .1,
		    fillColor: '#00396B',
		    center: circleCenter
		});

	    // Zoom.
    	map.setZoom(13);

	    // Initial messages load
    	loadMessages();
	}, function error(msg) { 
		spinner.hide();
		// Catastrophic failure.
		console.log(msg);
  	}, {
		maximumAge: 600000, 
		timeout: 7000, 
		enableHighAccuracy: true
	});
}

function sendMessage() {
	// Super mediocre validation.
	var messageInput = $('#message-input');
	var usernameInput = $('#username-input');

	if (messageInput.val() === null || messageInput.val() === '') {
		return;
	}

	if (usernameInput.val() === null || usernameInput.val() === '') {
		return;
	}

	// Start the process.
	var spinner = $('#m-spinner');
	spinner.show();

	// Geolocate.
	navigator.geolocation.getCurrentPosition(function(position) {
		// Build object to post.
	    var postData = { 
	    	latitude: position.coords.latitude,
	    	longitude: position.coords.longitude,
	    	username: usernameInput.val(),
	    	message: messageInput.val()
	    };

	    // Set last lat lng for re-retrieval.
	    lastLatLng = {
	    	latitude: position.coords.latitude,
	    	longitude: position.coords.longitude
	    };

	    // Post to API.
	    $.ajax({
			type: 'POST',
			data: JSON.stringify(postData),
	        contentType: 'application/json',
            url: '/message',						
            success: function(data) {
                if (data === 'Success!') {
                	loadMessages();
                }

			    messageInput.val('');
			    spinner.hide();
            }, error: function(jqXHR, textStatus, errorThrown) {
            	console.log(errorThrown);
			    messageInput.val('');
			    spinner.hide();
            }
        });
	}, function error(msg) { 
		// Catastrophic failure.
		console.log(msg);
		spinner.hide();
  	}, {
		maximumAge: 600000, 
		timeout: 7000, 
		enableHighAccuracy: true
	});
}

function resizeend() {
    if (new Date() - rtime < delta) {
        setTimeout(resizeend, delta);
    } else {
        timeout = false;
        resizeClient();
    }               
}

function resizeClient() {
	var windowHeight = window.innerHeight;

	// Size map.
	$('#posts-by-location').height(windowHeight - 212 + 'px');

	if (typeof google !== 'undefined') {
		google.maps.event.trigger(map, 'resize');
	}

	// Size post box.
	$('#posts-by-date').height(windowHeight - 260 + 'px');
}

function attachListeners() {
	// Message clicks.
	$('.m-posts article').click(function() {
		var clickedElement = $(this);
		
		// Latitude / longitude object.
		var markerLatLng = new google.maps.LatLng({ 
			lat: clickedElement.data('latitude'), 
			lng: clickedElement.data('longitude')
		});

		// Highlight.
		highlightMessageById(clickedElement.attr('id'));

		// Center on marker.
		map.setCenter(markerLatLng);
	});
}

function loadMessages() {
	var spinner = $('#m-spinner');
	spinner.show();

	console.log(lastLatLng);

	$.ajax({
		type: 'GET',
        url: '/messages',						
        success: function(data) {
        	if (data.length > 0) {
	            var source   = $('#message-template').html();
				var template = Handlebars.compile(source);
				var dataForTemplate = {
					messages: data
				}
				var htmlOutput = template(dataForTemplate);

				// Output compiled markup.
				$('#messages-output').html(htmlOutput);

				// Output markers.
    			addMessagesToMap(data);

				// Attach listeners to new markup.
				attachListeners();

				// Hide the "no messages" message.
	            $('#no-messages').hide();
	        }

            spinner.hide();
        }, error: function(jqXHR, textStatus, errorThrown) {
        	spinner.hide();
        	console.log(errorThrown);
        }
    });
}

$(document).ready(function() {
	// Resize the usable UI.
	resizeClient();

	// Message send.
	$('#post-button').click(function(e) {
		e.preventDefault();
		sendMessage();
	});

	$('#message-input').keypress(function(e) {
	    if(e.which == 13) {
	    	e.preventDefault();
	        sendMessage();
	    }
	});

	// Resize hacks
	$(window).resize(function() {
	    rtime = new Date();
	    if (timeout === false) {
	        timeout = true;
	        setTimeout(resizeend, delta);
	    }
	});
});
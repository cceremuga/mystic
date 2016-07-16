var map;

// Centers the map.
function centerOnPoint(latitude, longitude) {
	var updatedLatLng = new google.maps.LatLng({ 
		lat: latitude, 
		lng: longitude
	});

	map.setCenter(updatedLatLng);
}

function addMarkerWithInfoWindow(latitude, longitude, text) {
	// Make a window.
	var youWindow = new google.maps.InfoWindow({
        content: text
    });

	// Lat/long for pin.
	var markerLatLng = new google.maps.LatLng({ 
		lat: latitude, 
		lng: longitude
	});

	// Add pin.
	var youMarker = new google.maps.Marker({
        position: markerLatLng,
        map: map,
        title: 'You!'
    });

    // Add a listener in case they close it like a fool.
    youMarker.addListener('click', function() {
        youWindow.open(map, youMarker);
    });

    // Open Window.
    youWindow.open(map, youMarker);

    // Add circle of 5 mile radius.
	var circle = new google.maps.Circle({
	    map: map,
	    radius: 8046.72,  // 5 miles in meters
	    strokeColor: '#7F8DE1',
	    strokeWeight: 4,
	    fillOpacity: .1,
	    fillColor: '#00396B'
	});

	circle.bindTo('center', youMarker, 'position');
}

function addMessagesToMap() {
	for (var i = 0; i < messagesToDisplay.length; i++) {
		var markerLatLng = new google.maps.LatLng({ 
			lat: messagesToDisplay[i].x, 
			lng: messagesToDisplay[i].y
		});

		var messageMarker = new google.maps.Marker({
	        position: markerLatLng,
	        map: map
	    });
	}
}

// Initializes the map w/ geolocation.
function initMap() {
	// Build the map.
	map = new google.maps.Map(document.getElementById('posts-by-location'), {
		center: { lat: 41.850033, lng: -87.6500523 },
		zoom: 4,
		streetViewControl: false,
		mapTypeControl: false,
		mapTypeId: google.maps.MapTypeId.TERRAIN
	});

	// Geolocate.
	navigator.geolocation.getCurrentPosition(function(position) {
	    // Center.
	    centerOnPoint(position.coords.latitude, position.coords.longitude);

	    // Your marker.
	    addMarkerWithInfoWindow(position.coords.latitude, position.coords.longitude, 'This is you!');

	    // Zoom.
    	map.setZoom(13);

    	// Add messages.
    	addMessagesToMap();

	    // Hide loader.
	    $('#m-loader').fadeOut();
	}, function error(msg) { 
		alert('Please enable GPS, location access.');  
  	}, {
		maximumAge: 600000, 
		timeout: 7000, 
		enableHighAccuracy: true
	});
}

// Used to size boxes in the app.
$(document).ready(function() {
	var windowHeight = window.innerHeight;

	// Size map.
	$('#posts-by-location').height(windowHeight - 212 + 'px');

	// Size post box.
	$('#posts-by-date').height(windowHeight - 260 + 'px');
});
var map;

// Centers the map.
function centerOnPoint(latitude, longitude) {
	var updatedLatLng = new google.maps.LatLng({ 
		lat: latitude, 
		lng: longitude
	});

	map.setCenter(updatedLatLng);
}

// Initializes the map w/ geolocation.
function initMap() {
	// Build the map.
	map = new google.maps.Map(document.getElementById('posts-by-location'), {
		center: { lat: 41.850033, lng: -87.6500523 },
		zoom: 4
	});

	// Geolocate.
	navigator.geolocation.getCurrentPosition(function(position) {
	    // Center.
	    centerOnPoint(position.coords.latitude, position.coords.longitude);

	    // Zoom.
    	map.setZoom(13);

	    // Hide loader.
	    $('#m-loader').fadeOut();
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
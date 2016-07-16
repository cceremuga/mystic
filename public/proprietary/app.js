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

    //Open Window.
    youWindow.open(map, youMarker);
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

	    // Marker.
	    addMarkerWithInfoWindow(position.coords.latitude, position.coords.longitude, 'This is you!');

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
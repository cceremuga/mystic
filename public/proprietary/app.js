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

function highlightMessage(marker) {
	// Change highlight.
	$('.m-posts article').removeClass('slds-theme--alt-inverse');
	$('#msg-' + marker.title).addClass('slds-theme--alt-inverse');

	// Center on marker.
	var latLng = marker.getPosition();
	map.setCenter(latLng);
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
}

function addMessagesToMap() {
	// Adds all messages in the page as map markers with a Pokeball.
	for (var i = 0; i < messagesToDisplay.length; i++) {
		// Latitude / longitude object.
		var markerLatLng = new google.maps.LatLng({ 
			lat: messagesToDisplay[i].x, 
			lng: messagesToDisplay[i].y
		});

		addMessageToMap(markerLatLng, messagesToDisplay[i].id);
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
		styles: [{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#1c99ed"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#1f79b5"}]},{"featureType":"administrative.province","elementType":"labels.text.fill","stylers":[{"color":"#6d6d6d"},{"visibility":"on"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#555555"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#999999"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.government","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#e1eddd"}]},{"featureType":"poi.place_of_worship","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"},{"lightness":"45"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ff9500"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"on"},{"hue":"#009aff"},{"saturation":"100"},{"lightness":"5"}]},{"featureType":"road.highway.controlled_access","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#ff9500"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway.controlled_access","elementType":"labels.icon","stylers":[{"lightness":"1"},{"saturation":"100"},{"hue":"#009aff"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#8a8a8a"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"lightness":"33"},{"saturation":"-100"},{"visibility":"on"}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#4db4f8"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]}]
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
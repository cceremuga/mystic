var map;

$(document).ready(function() {
	var windowHeight = window.innerHeight;

	// Size map.

	// Size post box.
	$('#posts-by-date').height(windowHeight - 260 + 'px');
	$('#posts-by-location').height(windowHeight - 212 + 'px');
});

      
function initMap() {
	map = new google.maps.Map(document.getElementById('posts-by-location'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 8
	});
}
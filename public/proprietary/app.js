$(document).ready(function() {
	var windowHeight = window.innerHeight;
	console.log(windowHeight);
	$('#posts-by-date').height(windowHeight - 260 + 'px');
});
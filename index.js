var express = require('express');
var app = express();
var pg = require('pg');
var moment = require('moment');

// Set listening port.
app.set('port', (process.env.PORT || 5000));

// Set directory for static resources.
app.use(express.static(__dirname + '/public'));

// Master templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Index page.
app.get('/', function(request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  	// Retrieve all messages.
  	client.query('SELECT * FROM messages ORDER BY Id DESC LIMIT 10', function(err, result) {
  	  done();

  	  // Throw all errors into console / page.
  	  if (err) {
  	  	console.error(err);
  	  	response.send("Error " + err);
  	  } else {
  	  	// Render the home page with the records.
  	  	response.render('pages/index', {
  	  		messages: result.rows
  	  	});
  	  }
  	});
  });  
});

// Start server.
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
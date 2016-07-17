var express = require('express');
var app = express();
var pg = require('pg');
var moment = require('moment');
var bodyParser = require('body-parser');
var validator = require('validator');
var url = require('url');

// Set listening port.
app.set('port', (process.env.PORT || 5000));

// Set directory for static resources.
app.use(express.static(__dirname + '/public'));

// jSON body parser.
app.use(bodyParser.json());

// Master templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Index page.
app.get('/', function(request, response) {
  response.render('pages/index'); 
});

// jSON message retrieval endpoint.
app.get('/messages', function(request, response) {
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  	// Retrieve all messages including harversine calculation.
  	client.query('SELECT * FROM messages ' + 
  		'WHERE public.geodistance(location[0], location[1], $1, $2) <= $3 ' + 
  		'ORDER BY Id DESC LIMIT 10', 
  		[query.latitude, query.longitude, query.miles], function(err, result) {
  	  done();

  	  // Throw all errors into console / page.
  	  if (err) {
  	  	console.error(err);
  	  	response.send("Error!");
  	  } else {
  	  	// Do nasty stuff with dates here for now...
  	  	for (var i = 0; i < result.rows.length; i++) {
  	  		result.rows[i].relativetimestamp = moment(result.rows[i].timestamp).fromNow();
  	  	}

  	  	// Send jSON response.
  	  	response.send(result.rows);
  	  }
  	});
  });  
});

// Inserting new message endpoint.
app.post('/message', function(request, response) {
  // Sanitize input
  request.body.message = validator.escape(request.body.message);
  request.body.username = validator.escape(request.body.username);
  var formattedPoint = '(' + request.body.latitude + ',' + request.body.longitude + ')';

  var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  // Disgusting insert.
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('INSERT INTO messages (ip, location, message, username) VALUES($1, $2, $3, $4) RETURNING id', 
    	[ip, formattedPoint, request.body.message, request.body.username], 
      function(err, result) {
      	  done();

          if (err) {
            console.log(err);
            response.send('Error!');
          } else {
            response.send('Success!');
          }
        }); 
  });
});

// Start server.
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
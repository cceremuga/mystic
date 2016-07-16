var express = require('express');
var app = express();
var pg = require('pg');

// Set listening port.
app.set('port', (process.env.PORT || 5000));

// Set directory for static resources.
app.use(express.static(__dirname + '/public'));

// Master templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Index page.
app.get('/', function(request, response) {
  response.render('pages/index');
});

// Db test page.
app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});

// Start server.
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
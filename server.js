var express = require('express'), 
app = express(), 
http = require('http');



// web server
var server = http.createServer(app);

app.configure(function () {
  this.use(express.static(__dirname + '/public', { maxAge: oneYear }));
	// Allow parsing form data
	this.use(express.bodyParser());
	
});

app.configure('development', function () {
	this.use(express.errorHandler({
			dumpExceptions : true,
			showStack : true
		}));
});

app.configure('production', function () {
	this.use(express.errorHandler());
});

var ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('view options', {
	layout : false
});
app.set('views', __dirname + '/views');

app.get('/', function (req, res) {
	res.render('index.ejs');
});

app.get('/lab/*', function (req, res) {
	res.render('index.ejs');
});

app.get('/ping', function (req, res) {
	res.send('pong');
});


//this line is necessary for heroku
server.listen(process.env.PORT || 3003);

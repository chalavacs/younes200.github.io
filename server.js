var express = require('express'), 
app = express(), 
http = require('http');

var Notifo = require('notifo');

var notification = new Notifo({
    'username': 'laughingman'
    , 'secret': 'xf7fa6c673947f6383e893eecedecae90e38b6f91'
});




// web server
var server = http.createServer(app);

app.configure(function () {
  var oneYear = 31557600000;
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

app.post("/contact", function (req, res){
    
  notification.send({
    'title': 'Home page'
    , 'uri': ''
    , 'msg': req.body.message
}, function(err, response) {
    if (err) {
        throw err
    } else {
        console.log(response);
    }
});

  res.send('pong');

});


//this line is necessary for heroku
server.listen(process.env.PORT || 3003);

var express = require('express');
var server = express.createServer(express.logger());



server.configure(function(){
  var oneYear = 31557600000;
  server.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  server.use(express.errorHandler());
});

var ejs = require('ejs');
server.set('view engine', 'ejs');
server.set('view options', { layout: false });
server.set('views', __dirname + '/views');

server.get('/', function(req, res){

	var mes = "<p>hello world!</p>";
	res.render('index.ejs', {locals:{mes:mes}});
});

//this line is necessary for heroku
var port = process.env.PORT || 3003;
server.listen(port);
var express = require('express'), 
app = express(), 
path = require('path'),
http = require('http');

var Notifo = require('notifo');

var notification = new Notifo({
    'username': 'laughingman'
    , 'secret': 'xf7fa6c673947f6383e893eecedecae90e38b6f91'
});




// web server
var server = http.createServer(app);

app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout : false });
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  //app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(require('connect-assets')({build: true}))
  
  //Replace the default connect or express static provider with gzippo's
  app.use(express.static(path.join(__dirname, 'public')));  
  //app.use(gzippo.staticGzip(path.join(__dirname + '/public')));
});


app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/', function (req, res) {
   res.render('index');
});

app.get('/about', function (req, res) {
   res.render('about');
});

app.get('/lab/*', function (req, res) {
	res.render('index');
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

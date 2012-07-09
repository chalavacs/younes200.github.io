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

server.get('/ping', function(req, res) {
    res.send('pong');
});

var redis = require('redis-url').connect(process.env.REDISTOGO_URL|| "redis://localhost:6379");


var io = require('socket.io');
var _ = require('underscore')._;

io = io.listen(server);
io.configure(function(){
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
  io.set("close timeout", 10);
  io.set("log level", 1);
})

var users = {};

// clear draw data
redis.del("drawdata");

io.sockets.on('connection', function (socket) {
  var user = {}
  var has_draw = false;
  
  
  
  
  redis.get("drawdata" , function(err, data) {
    if(data){
     has_draw = true;
    }
  });
  
  
  


  socket.emit('users-connected', _.values(users));
  
  
  redis.get("drawdata" , function(err, data) {
    
    if(data){
      
      try { var drawdata = JSON.parse("["+data+"]") }
      catch (SyntaxError) { return false; }
      socket.emit('receive-draw-bulk', drawdata);
       has_draw = true;
    }
  });

  socket.on('new-user', function (data) {
    user = data
    user.cursor = {x:0,y:0}
    users[user.id] = data
    socket.broadcast.emit('user-connected', data);
    
    

  });

  socket.on('message', function(msgInfo){
    msgInfo.isFromMe = false;
    socket.broadcast.emit('receive-message', msgInfo);
  });

  socket.on('mousemove', function (data) {
    user.cursor = data
    socket.broadcast.emit('receive-mousemove', user);
  });
  
  
  socket.on('draw', function (data) {
    socket.broadcast.emit('receive-draw', data);
    if(has_draw)
    {
      redis.append('drawdata', ","+JSON.stringify(data));
    }else {
      redis.set('drawdata',JSON.stringify(data));
      has_draw = true;
    }
  });
  
  socket.on('draw-clear', function(data){
    redis.del('drawdata');
    has_draw = false;
    socket.broadcast.emit('receive-draw-clear');
  });
  
  socket.on('disconnect', function(){
    if(user){
      delete users[user.id];
      socket.broadcast.emit('user-disconnected', user);
    };
  })
});

/*
redis.subscribeTo("draw_stream", function(channel, message, pattern) {
    try { var draw_data = JSON.parse(message); }
    catch (SyntaxError) { return false; }

    if ( flight.origin.iata == "BOS" || flight.destination.iata == "BOS") {
        socket.broadcast.emit('receive-draw', data);
    }
});
*/

//console.log(Math.round(new Date().getTime() / 1000).toString());
//redis.del("drawdata");




//redis.del("drawdata");




//this line is necessary for heroku
var port = process.env.PORT || 3003;
server.listen(port);
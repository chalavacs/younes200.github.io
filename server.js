var express = require('express')
  , cookie = require('cookie')
  , connect = require('connect')
  , app = module.exports = express.createServer()
  , http    = require('http');


  
const COOKIE_SECRET= "dfsiumzzbmyblmglwxwc";

// redis
var redis = require('redis-url').connect(process.env.REDISTOGO_URL|| "redis://localhost:6379");
redis.del("drawdata"); // clear data



// web server

app.configure(function(){
    
  var oneYear = 31557600000;
  this.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  
  // Session management
  // Internal session data storage engine, this is the default engine embedded with connect.
  // Much more can be found as external modules (Redis, Mongo, Mysql, file...). look at "npm search connect session store"
  this.sessionStore = new express.session.MemoryStore({ reapInterval: 60000 * 10 });
  
  // Allow parsing cookies from request headers
  this.use(express.cookieParser());
  // Session management
  this.use(express.session({
    // Private crypting key
    "secret": COOKIE_SECRET,
    "store":  this.sessionStore  
  }));
  
  // Allow parsing form data
  this.use(express.bodyParser());
  
});


app.configure('development', function(){
  this.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  this.use(express.errorHandler());
});



var ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.set('views', __dirname + '/views');


app.get('/', function(req, res){
    
   
    
  if (!req.session.user_id) {
    req.session.user_id = Math.round(Math.random() * 10000);
    console.log("new session.user_id=",  req.session.user_id);
  }else {
     console.log("session user_id=", req.session.user_id);
  }
	res.render('index.ejs');
});


app.get('/lab/*', function(req, res){
  res.render('index.ejs');
});

app.get('/ping', function(req, res) {
    res.send('pong');
});



// socket.io
var io = require('socket.io').listen(app, { log: true });


var _ = require('underscore')._;
var users = {};

io.configure(function(){
    
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
  io.set("close timeout", 10);
  io.set("log level", 1);
 

  io.set('authorization', function (handshakeData, callback) {
      
     // Read cookies from handshake headers
     var cookies = cookie.parse(decodeURIComponent(handshakeData.headers.cookie));
     //var cookies = connect.utils.parseSignedCookies(cookie.parse(decodeURIComponent(handshakeData.headers.cookie)),COOKIE_SECRET);
     
     // We're now able to retrieve session ID
     var sessionID = cookies['connect.sid'];
     
     console.log("handshakeData.headers.cookie="+handshakeData.headers.cookie);
     console.log("cookies="+cookies['user_id']);
     
     // No session? Refuse connection
    if (!sessionID) {
      callback('No session', false);
    } else {
      // Store session ID in handshake data, we'll use it later to associate
      // session with open sockets
      handshakeData.sessionID = sessionID;
      
      app.sessionStore.get(sessionID, function (err, session) {
        
        if (!err && session && session.user_id) {
          // On stocke ce username dans les données de l'authentification, pour réutilisation directe plus tard
          handshakeData.user_id = session.user_id;
          // OK, on accepte la connexion
          callback(null, true);
        } else {
           console.log("sessionStore.get error="+err);
          // Session incomplète, ou non trouvée
          callback(err || 'User not authenticated', false);
        }
        
      });
      
    }
  });


})

io.sockets.on('connection', function (socket) {
  var user = {}
  var has_draw = false;
  
  socket.emit('users', _.values(users));
  
  
  redis.get("drawdata" , function(err, data) {
    if(data){
     has_draw = true;
      try { 
        var drawdata = JSON.parse("["+data+"]") 
      }
      catch (SyntaxError) { return false; }
      
      socket.emit('receive-draw-bulk', drawdata);
    }
  });

  
  redis.get("user:"+socket.handshake.user_id , function(err, data) {

    user = {}
    if(!data)
    {
      user.cursor = {x:0,y:0}
      user.id = socket.handshake.user_id;
      
      // storing new user 
      console.log("storing new user data=",user.id);
      redis.set("user:"+socket.handshake.user_id, user);
    }else {
      user = data;
      console.log("user data found data=",user.id);
    }
    
    // keep user id into memory for easy access
    users[user.id] = user
    socket.broadcast.emit('join', user);
    
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
      socket.broadcast.emit('leave', user);
    };
  })
  
  
});


//this line is necessary for heroku
app.listen( process.env.PORT || 3003 );






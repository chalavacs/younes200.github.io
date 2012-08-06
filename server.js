var express = require('express'), cookie = require('cookie'), connect = require('connect'), app = express(), http = require('http'), RedisStore = require('connect-redis')(express);

const COOKIE_SECRET = "dfsiumzzbmyblmglwxwc";
cookie.secret = COOKIE_SECRET;

// redis
var redis = require('redis-url').connect(process.env.REDISTOGO_URL || "redis://localhost:6379");
redis.on("error", function (err) {
	console.log("Error " + err);
});

redis.del("drawdata"); // clear data


// web server

app.configure(function () {
	
	var oneYear = 31557600000;
	this.use(express.static(__dirname + '/public', {
			maxAge : oneYear
		}));
	
	this.redisStore = new RedisStore();
	
	// Allow parsing cookies from request headers
	this.use(express.cookieParser(COOKIE_SECRET));
	// Session management
	this.use(express.session({
			store : this.redisStore
		}));
	
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
	
	if (!req.session.user_id) {
		req.session.user_id = Math.round(Math.random() * 10000);
		req.session.save();
		console.log("new user_id=", req.session.user_id);
	} else {
		console.log("found user_id=", req.session.user_id);
	}
	res.render('index.ejs');
});

app.get('/lab/*', function (req, res) {
	res.render('index.ejs');
});

app.get('/ping', function (req, res) {
	res.send('pong');
});

// socket.io
var server = http.createServer(app);
var io = require('socket.io').listen(server, {
		log : true
	});

var _ = require('underscore')._;
var users = {};

io.configure(function () {
	
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10);
	io.set("log level", 1);
	
	io.set('authorization', function (handshakeData, callback) {
		
		// Read cookies from handshake headers
		var cookies = cookie.parse(decodeURIComponent(handshakeData.headers.cookie));
		//var cookies = connect.utils.parseSignedCookies(cookie.parse(decodeURIComponent(handshakeData.headers.cookie)),COOKIE_SECRET);
		
		// We're now able to retrieve session ID
		var sessionID = cookies['connect.sid'].split('.')[0].split(':')[1];
		
		console.log("sessionID=" + sessionID);
		
		// No session? Refuse connection
		if (!sessionID) {
			callback('No session', false);
		} else {
			// Store session ID in handshake data, we'll use it later to associate
			// session with open sockets
			
			
			app.redisStore.get(sessionID, function (err, session) {
				
				console.log("app.sessionStore.get user_id=" + session.user_id);
				
				if (!err && session && session.user_id) {
					// On stocke ce username dans les données de l'authentification, pour réutilisation directe plus tard
					handshakeData.user_id = session.user_id;
					handshakeData.sessionID = sessionID;
					
					// OK, on accepte la connexion
					callback(null, true);
					
				} else {
					console.log("sessionStore.get error=" + err);
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
	
	
	
	redis.get("user_" + socket.handshake.user_id, function (err, data) {
		
		if (!data) {
      
			user.cursor = {
				x : 0,
				y : 0
			}
			user.id = socket.handshake.user_id;
      user.draw = [];
      
			// storing new user
			redis.set("user_" + socket.handshake.user_id, JSON.stringify(user));
      
		} else {
      
      // parse existing data
			user = JSON.parse(data);
      user.id = socket.handshake.user_id;
      // get user draw info
      
			redis.get("user_" + user.id + "_draw", function (err, data) {
				if (data) {
					has_draw = true;
					try {
						var draw = JSON.parse("[" + data + "]")
            user.draw = draw;
            
					} catch (SyntaxError) {
						return false;
					}
				}
        socket.broadcast.emit('join', user);
        socket.emit('me', user);
			});
			
		}
    
    // keep user id into memory for easy access
    users[user.id] = user
		
	});
	
  
  socket.emit('users', _.values(users));
  
  
	socket.on('message', function (msgInfo) {
		msgInfo.isFromMe = false;
		socket.broadcast.emit('receive-message', msgInfo);
	});
	
	socket.on('mousemove', function (data) {
		user.cursor = data
			socket.broadcast.emit('receive-mousemove', user);
	});
	
	socket.on('draw', function (data) {
		socket.broadcast.emit('receive-draw', data);
		if (has_draw) {
			redis.append("user_" + user.id + "_draw", "," + JSON.stringify(data));
		} else {
			redis.set("user_" + user.id + "_draw", JSON.stringify(data));
			has_draw = true;
		}
	});
	
	socket.on('clear', function (data) {
		redis.del("user_" + user.id + "_draw");
		has_draw = false;
		socket.broadcast.emit('user-clear');
	});
	
	socket.on('disconnect', function () {
		if (user) {
			delete users[user.id];
			socket.broadcast.emit('leave', user);
		};
	})
	
});

//this line is necessary for heroku
server.listen(process.env.PORT || 3003);

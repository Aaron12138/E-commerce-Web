var express = require('express'); // require express library
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session); 
var passport = require('passport');

var secret = require('./config/secret');
var User = require('./models/user');

var app = express(); // app is express object

mongoose.connect(secret.database, function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log("Connected to the database");
	}
});

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(session({
	resave: true, // fo rce the session to save back to the seesion store
	saveUninitialized: true,
	secret: secret.secretKey,
	store: new MongoStore({ url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
app.use(mainRoutes);
app.use(userRoutes);





//app.post(); // send something to server

//app.put(); // update the data

//app.delete('/'); // delete

// run the server first
app.listen(secret.port, function(err) { // err validation for the server
	if (err) throw err;
	console.log("Server is Running on port " + secret.port)
}); 
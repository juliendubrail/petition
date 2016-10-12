//dependencies
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
// var bcrypt = require('bcrypt');



//SERVER
var express = require('express');
var app = express();

//view engine setup
var hb = require('express-handlebars');
app.engine('handlebars',hb());
app.set('view engine', 'handlebars');

// Add cookie parser
app.use(cookieParser());
app.use(cookieSession({
    secret: 'hello',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.listen(3000, function() {
    console.log("the application is running on localhost 3000");
});


//Form

app.post('/thanks', urlencodedParser, function(req, res){
    const signatures = req.body;
    //Database
    var db = require('./db.js');
    var params = [signatures.firstname, signatures.lastname, signatures.signature];

    if (signatures.firstname && signatures.lastname && signatures.signature != "not signed"){
        db.insert(params, function(err, number){
            if (err) {
                res.status(500).send("Server Error");
            }
            else {
                console.log("the id " + number);
                req.session.signatureId = number;
                res.cookie('cookie', number, {maxAge: 1000000});
                console.log("the body" + req.body);
                res.render('contact-success', {data:req.body}); }
        });
    }
    else {
        res.render('error');
    }
});

// Routes

app.get('*', function (req, res, next){
    var db = require('./db.js');

    if (req.session.signatureId) {
        db.displayBody([req.session.signatureId], function(err, results){
            console.log("the cookie " + req.cookies);
            console.log(results);
            res.render('contact-success', {data:results[0]});
        });


    }
    else {
        next();
    }
});

var routes = require('./routes');
app.get('/', routes.home);


// Hash the password with a Salt

function hashPassword(plainTextPassword, callback) {
    bcrypt.genSalt(function(err, salt) {
        if (err) {
            return callback(err);
        }
        console.log(salt);
        bcrypt.hash(plainTextPassword, salt, function(err, hash) {
            if (err) {
                return callback(err);
            }
            console.log(hash);
            callback(null, hash);
            // Store hash in password DB.
        });
    });
}

// hashPassword(Teddy, insert);

// Load password hash from DB
function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase, callback) {
    bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
        if (err) {
            return callback(err);
        }
        console.log(doesMatch);
        callback(null, doesMatch);
    });
}

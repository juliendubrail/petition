//dependencies
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var db = require('./db.js');

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


// Initial Signature Form
// app.post('/thanks', urlencodedParser, function(req, res){
//     const signatures = req.body;
//     var db = require('./db.js');
//     var params = [signatures.firstname, signatures.lastname, signatures.signature];
//
//     if (signatures.firstname && signatures.lastname && signatures.signature != "not signed"){
//         db.insert(params, function(err, number){
//             if (err) {
//                 res.status(500).send("Server Error");
//             }
//             else {
//                 console.log("the id " + number);
//                 req.session.signatureId = number;
//                 res.cookie('cookie', number, {maxAge: 300000});
//                 console.log("the body" + req.body);
//                 res.render('contact-success', {data:req.body}); }
//         });
//     }
//     else {
//         res.render('error');
//     }
// });



// Register Form without signature

app.post('/', urlencodedParser, function(req, res){
    const inputs = req.body;
    console.log(req.body);

    db.hashPassword(inputs.password, function(err, hash){
        if(err) {
            console.log(err, "1000");
            res.render('error');
        }
        else{
            console.log(hash);
            var params = [inputs.firstname, inputs.lastname, inputs.email, hash];
            if (inputs.firstname && inputs.lastname && inputs.email && inputs.password){
                db.insertUsers(params, function(err, number){
                    if (err) {
                        console.log(err);
                        res.status(500).send("Server Error");
                    }
                    else {
                        console.log("the id " + number);
                        req.session.signatureId = number;
                        // res.cookie('cookie', number, {maxAge: 300000});
                        console.log("the body" + req.body);
                        req.session.user = {
                            id: number,
                            firstname: inputs.firstname,
                            lastname: inputs.lastname,
                            email: inputs.email
                        };
                        res.redirect('/profile');

                    }
                });
            }
            else {
                res.render('error');
            }
        }
    });
});



app.post('/profile', urlencodedParser, function(req, res){
    const profile = req.body;
    console.log(req.body);
    var params = [profile.age, profile.city, profile.url, req.session.user.id];
    db.insertProfile(params, function(err, results){
        if (err) {
            console.log(err);
            res.status(500).send("Server Error");
        }
        else {
            console.log("the body" + req.body);
            console.log(results);
            res.redirect('/sign'); }
    });
});


// Login Form
app.post('/login', urlencodedParser, function(req, res){
    const login = req.body;
    var db = require('./db.js');
    db.getEmail([login.email], function(err, results){
        if (err){
            console.log("la loose" + err);
        }
        else {

            db.checkPassword(login.password, results.password, function(err, answer){
                if (err){
                    console.log("la loose " + err);
                }
                else {
                    console.log("super");
                    console.log(answer);
                    res.redirect('/sign');
                    // req.session.user = [results.firstname, results.lastname, results.id];
                }
            });
        }
    });
});


// Sign Form
app.post('/sign', urlencodedParser, function(req, res){
    const sign = req.body;
    console.log(req.body);
    var params = [sign.signature, req.session.user.firstname, req.session.user.lastname, req.session.user.id ];
    db.insertSignature(params, function(err, results){
        if (err){
            console.log("la loose" + err);
        }
        else {
            console.log(results);
            req.session.user.signature = {};
            req.session.user.signature.id = results;
            console.log(req.session);
            res.redirect('/thanks');
        }
    });
});

app.post('/profile/edit', urlencodedParser, function(req, res){
    const update = req.body;
    console.log(req.body);
    var param1 = [update.age, update.city, update.url];

    if (update.password!=""){
        db.hashPassword(update.password, function(err, hash){
            if(err) {
                console.log(err, "1000");
                res.render('error');
            }
            else{
                console.log(hash);
                console.log(req.session.user.id);
                var param = [hash, req.session.user.id];
                db.updatePassword(param, function(err){
                    if(err){
                        console.log("la loo" + err);
                    }
                    else{
                        console.log("test");
                    }
                });
            }

        });
    }
    else{
        console.log(req.session.user.id);
        var param = [update.firstname, update.lastname, update.email, req.session.user.id];
        db.updateUser(param, function(err, results){
            if(err){
                console.log("la lo" + err);
            }
            else{
                console.log(results);
                console.log("ca a foire");
            }
        });
    }
    db.updateProfile(param1, function(err, results){
        if(err){
            console.log("la loose" + err);
        }
        else{
            console.log(results);
            res.redirect('/sign');
        }
    });

});

//signers
// app.get('/signers', urlencodedParser, function(req,res){
//     db.getSigners(function(err, results) {
//         res.render('signers.handlebars', {results});
//     });
// });


// Routes
// app.get('*', function (req, res, next){
//     var db = require('./db.js');
//
//     if (req.session.signatureId) {
//         db.displaySignature([req.session.signatureId], function(err, results){
//             console.log("the cookie " + req.cookies);
//             console.log(results);
//             res.render('contact-success', {data:results[0]});
//             req.session = null;
//         });
//     }
//     else {
//         next();
//     }
// });

// Get Routes
var routes = require('./routes');
app.get('/', routes.home);
app.get('/login', routes.login);
app.get('/signers', routes.signers);
app.get('/sign', routes.sign);
app.get('/profile', routes.profile);
app.get('/thanks', routes.thanks);
app.get('/signers', routes.signers);
app.get('/signers/:city', routes.city);
app.get('/profile/edit', routes.update);

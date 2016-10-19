// Home Route
var db = require('../db.js');

exports.home = function(req, res) {
    res.render('home');
};

exports.login = function( req,res){
    res.render('login');
};

exports.sign = function(req,res){
    res.render('sign');
};

exports.profile = function(req,res){
    res.render('profile');
};

exports.thanks = function(req,res){
    console.log(req.session);
    db.getSignature([req.session.user.signature.id], function(err, results){
        if(err){
            console.log(err);
        }else{
            res.render('thanks', {signature:results});
        }
    });
};

exports.signers = function (req,res){
    db.getSigners(function(err,results){
        if(err){
            console.log("la losse", err);
        }else{
            res.render('signers', {persons:results});
        }
    });
};

exports.city = function (req,res){
    var city = req.params.city;
    db.getCity(city, function(err,results){
        if(err){
            console.log("la loose, err");
        }else {
            res.render('city', {persons:results});
        }
    });
};

exports.update = function(req,res){
    var user = req.session.user.id;
    console.log(user);
    db.displayProfile(user, function(err, results){
        if(err){
            console.log("la loose, err");
        }else{
            console.log(results);
            console.log(results.firstname);
            res.render('profile_update',{user:results});
        }
    });
};

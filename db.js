
module.exports.insert = insert;
module.exports.insertUsers = insertUsers;
module.exports.insertProfile = insertProfile;
module.exports.insertSignature = insertSignature;
module.exports.displaySignature = displaySignature;
module.exports.getSignature = getSignature;
module.exports.hashPassword = hashPassword;
module.exports.checkPassword = checkPassword;
module.exports.getEmail = getEmail;
module.exports.getSigners = getSigners;
module.exports.getCity = getCity;
module.exports.getProfiles = getProfiles;
module.exports.displayProfile = displayProfile;
module.exports.updateProfile = updateProfile;
module.exports.updateUser = updateUser;
module.exports.updatePassword = updatePassword;


var pg = require('pg');
// var dbUrl = "pg://postgres:julienspices:spicedacademy@localhost:5432/petition";
var dbUrl = process.env.DATABASE_URL || 'postgres://julienspices:spicedacademy@localhost:5432/petition';


dbUrl = require('url').parse(dbUrl);

var dbUser = dbUrl.auth.split(':');

var dbConfig = {
    user: dbUser[0],
    database: dbUrl.pathname.slice(1),
    password: dbUser[1],
    host: dbUrl.hostname,
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};

var pool = new pg.Pool(dbConfig);

pool.on('error', function(err) {
    console.log("the" + err);
});

// var client = new pg.Client(dbUrl);
// client.connect();
var bcrypt = require('bcrypt');


// function queryDatabase(query, params, callback){
//     client.query(query, params, function(err, results){
//         if(err) {
//             callback(err);
//         }
//         else{
//             callback(null, results);
//         }
//     });
// }


function queryDatabase (str, params, callback) {
    pool.connect(function(err, client, done) {
        if (err) {
            callback(err);
            return;
        }
        client.query(str, params || [], function(err, data) {
            if (err) {
                callback(err);
            } else {
                console.log("pool resolving");
                callback(null, data);
            }
            done();
        });
    });
}





function insert(params, callback) {
    var query = "INSERT INTO signs (firstname, lastname, signature) VALUES ($1, $2, $3) RETURNING id";
    queryDatabase(query, params, function(err,results){
        if(err){
            callback(err);
        }
        else{
            callback(null, results.rows[0].id);
        }
    });
}

function displaySignature (params, callback) {
// var query = "SELECT id, firstname, lastname, signature FROM signs ORDER BY id, lastname, firstname, signature";
    var query = "SELECT id, firstname, lastname, signature FROM signs WHERE id=$1";
    queryDatabase (query, params, function(err, results){
        console.log(results);
        if(err){
            callback(err);
        }
        else{
            callback(null, results.rows);
        }
    });
}

function insertUsers(params, callback) {
    var query = "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id";
    queryDatabase(query, params, function(err,results){
        if(err){
            callback(err);
        }
        else{
            callback(null, results.rows[0].id);
        }
    });
}

function insertProfile(params, callback) {
    var query = "INSERT INTO users_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4) RETURNING id";
    queryDatabase(query, params, function(err,results){
        if(err){
            callback(err);
        }
        else{
            callback(null, results.rows[0].id);
        }
    });
}

function insertSignature(params, callback) {
    var query = "INSERT INTO signs (signature, firstname, lastname, userid) VALUES ($1, $2, $3, $4) RETURNING id";
    queryDatabase(query, params, function(err,results){
        if(err){
            callback(err);
        }
        else{
            callback(null, results.rows[0].id);
        }
    });
}

function getSignature(params, callback) {
    var query = "SELECT signature FROM signs where id=$1";
    queryDatabase(query, params, function(err,results){
        if(err){
            callback(err);
        }
        else{
            callback(null, results.rows[0].signature);
        }
    });
}

function getSigners(callback) {
    var query = "SELECT users.firstname, users.lastname, users_profiles.age, users_profiles.city, users_profiles.url FROM users JOIN users_profiles ON users.id = users_profiles.user_id";
    client.query(query, function(err, results){
        if(err) {
            callback(err);
        }
        else{
            console.log("Hey there");
            console.log(results);
            callback(null, results.rows);
        }
    });
}

function getCity(params, callback) {
    var query = "SELECT users.firstname, users.lastname, users_profiles.age, users_profiles.city, users_profiles.url FROM users JOIN users_profiles ON users.id = users_profiles.user_id WHERE users_profiles.city='" + params + "'";
    client.query(query, function(err, results){
        if(err) {
            callback(err);
        }
        else{
            console.log("Hey there");
            console.log(results);
            callback(null, results.rows);
        }
    });
}


function getProfiles(callback) {
    var query = "SELECT age, city FROM users_profiles";
    client.query(query, function(err, data){
        if(err) {
            callback(err);
        }
        else{
            callback(null, data.rows);
        }
    });
}

// for displaying user infos on the update page
function displayProfile(params, callback) {
    var query = "SELECT users.firstname, users.lastname, users.email, users.password, users_profiles.age, users_profiles.city, users_profiles.url FROM users JOIN users_profiles ON users.id = users_profiles.user_id WHERE users.id='" + params + "'";
    client.query(query, function(err, data){
        if(err) {
            callback(err);
        }
        else{
            callback(null, data.rows[0]);
        }
    });
}


// for updating user profile infos on the update page
function updateProfile(params, callback) {
    var query_profile = "INSERT INTO users_profiles (age, city, url) VALUES ($1, $2, $3) RETURNING id";
    queryDatabase(query_profile, params, function(err,results){
        if(err){
            callback(err);
        }
        else{
            callback(null, results.rows[0].id);
        }
    });
}
// for updating user infos on the update page
function updateUser(params, callback) {
    var query = "UPDATE users SET firstname=$1, lastname=$2, email=$3 WHERE id=$4";
    queryDatabase(query, params, function(err){
        if(err){
            callback(err);
        }
        else{
            console.log("user infos updated");
        }
    });
}

function updatePassword(params, callback) {
    var query = "UPDATE users SET password=$1 WHERE id=$2";
    queryDatabase(query, params, function(err){
        if(err){
            callback(err);
        }
        else{
            console.log("user password updated");
        }
    });
}


// Hash the password with a Salt
function hashPassword(plainTextPassword, callback) {
    bcrypt.genSalt(function(err, salt) {
        if (err) {
            return callback(err);
        }
        console.log(salt, plainTextPassword);
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

function getEmail(params, callback){
    var query = "SELECT * FROM users WHERE email=$1";
    console.log(params);
    queryDatabase(query, params, function(err, results){
        if(err){
            callback(err);
        }
        else{
            callback(null, results.rows[0]);
        }
    });
}

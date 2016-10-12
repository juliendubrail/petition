
module.exports.insert = insert;
module.exports.displayBody = displayBody;

var pg = require('pg');
var dbUrl = "pg://postgres:julienspices:spicedacademy@localhost:5432/petition";
var client = new pg.Client(dbUrl);
client.connect();

function queryDatabase(query,params, callback){
    client.query(query, params, function(err, results){
        if(err) {
            callback(err);
        }
        else{
            callback(null, results);
        }
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

function displayBody (params, callback) {

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

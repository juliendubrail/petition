// Home Route
exports.home = function(req, res) {
    console.log(req.cookies);
    console.log("Holla");

    res.render('home');

};

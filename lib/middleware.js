
//need to be logged in to get to some pages
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

//not logged in - check if I am not authenticated
function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

//user is admin
function isAdmin(req, res, next) {
    if (req.user.isAdmin)
        return next();
    res.redirect('/');
}

let middleware = {};
middleware.isLoggedIn = isLoggedIn;
middleware.notLoggedIn = notLoggedIn;
middleware.isAdmin = isAdmin;
module.exports = middleware;
var express = require('express');

//register
let csrf = require("csurf");//needs sessions
var passport = require("passport");//defining passport
var User = require("../models/user.model");
var Order = require('../models/order.model');
var Cart = require('../models/cart.model');
var router = express.Router();

let csrfProtection = csrf();
router.use(csrfProtection);
const user_controller = require('../controllers/user.controller');



router.get('/viewusers', isLoggedIn, isAdmin, function (req, res, next) {
    User.find(function (err, docs) {
        var UserAcc= [];
        var accSize = 1;
        for (var i = 0; i < docs.length; i += accSize) {
            UserAcc.push(docs.slice(i, i + accSize));
        }
        res.render('user/viewusers', { title: 'Users', users: UserAcc });
    });

});

//on success redirect to profile page/ needs protection - logged in - reference to function
router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({ user: req.user }, function (err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
    
        res.render('user/profile', { csrfToken: req.csrfToken(), orders: orders, title: "Profile", user : req.user});
    });
    
});

//update user
router.put('/:id/update', isLoggedIn, user_controller.user_update);
//you can only log out if you are logged in
router.get("/logout", isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect("/");
});

//all routes where user can be not logged in come after this route IMPORTANT!!!
router.use("/", notLoggedIn, function (req, res, next) {
    next();
});


router.get("/register", function (req, res, next) {
    var messages = req.flash("error");//message stored under error - passport.js
    res.render("user/register", { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, title: "Register" });   ///error message, hasErrors - check on sinlgle properties in handlebars
});

router.post("/register", passport.authenticate("local.signup", {
    failureRedirect: "/user/register",
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

//on success redirect to profile page
router.get("/login", function (req, res, next) {
    var messages = req.flash("error");//message stored under error - passport.js
    res.render("user/login", { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, title: "Log In" });   ///error message, hasErrors - check on sinlgle properties in handlebars
});

router.post("/login", passport.authenticate("local.signin", {
    failureRedirect: "/user/login",
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
    });

router.get('/dashboard', isAdmin, isLoggedIn, function (req, res) {
    console.log(user.name);
    User.findById(req.params.id, function (err, user) {
        if (err) return next(err);
        console.log(user.name);
    res.render('admin/dashboard', { title: 'Dashboard', layout: false, user : req.user});
});
});


//delete user
router.delete('/:id/delete', user_controller.user_delete);

module.exports = router;

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


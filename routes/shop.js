var express = require('express');
var router = express.Router();
var Product = require("../models/product.model");
var Cart = require("../models/cart.model");
var Order = require('../models/order.model');


router.get('/add-to-cart/:id', function (req, res) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/shop');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/shop');
    })
});

router.get('/reduce/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shop/shopping-cart');
});

router.get('/remove/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shop/shopping-cart');
});

router.get('/shopping-cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', { products: null });
    }
    var cart = new Cart(req.session.cart);
    return res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get('/checkout', isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shop/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    return res.render('shop/checkout', { total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
});

router.post('/checkout', isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shop/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
        "sk_test_pVJhFSD0tie3QmfWqzusM6ib"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function (err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/shop/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function (err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    });
});



router.post('/search', function (req, res) {
    console.log("in search");
    var query = { $text: { $search: req.query.search, $language: 'en' } };

    console.log(query);
}, function (err, query) {
    if (err) return err;
    console.log(query);
    res.send(query);
    res.render('shop/viewproducts', { title: 'Products Found', docs: docs, successMgs: successMgs, noMessage: !successMgs });
});


//const product_controller = require('../controllers/product.controller');

/* GET shop page. */
router.get('/', function (req, res, next) {
    var successMgs = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/viewproducts', { title: 'Shop', products: productChunks, successMgs: successMgs, noMessage: !successMgs });
    });
});




//router.get('/createproduct', function (req, res) {
  //  res.render('admin/products/createproduct', { title: 'Create product' });
//});

//router.post('/create', product_controller.product_create);
//router.get('/:id', product_controller.product_details);
//update product
//router.put('/:id/update', product_controller.product_update);
//delete product
//router.delete('/:id/delete', product_controller.product_delete);
// a simple test url to check that all of our files are communicating correctly.
//router.get('/test', product_controller.test);

router.get('/:id/details', function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err) return next(err);
        res.render('shop/productdetails', { title: 'Product details', product: product });
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/login');
}



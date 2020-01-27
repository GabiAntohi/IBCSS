const express = require('express');
const router = express.Router();
const middleware = require('../lib/middleware');
const Product = require("../models/product.model");
const User = require("../models/user.model");
const Contact = require("../models/contact.model");
const multer = require('multer');
const upload = multer({dest:'uploads/'});

router.use(middleware.isLoggedIn);
router.use(middleware.isAdmin);

/* GET home page. */
router.get('/dashboard', function (req, res) {
    res.render('admin/dashboard', { title: 'IBCSS Dashboard', layout: false });
});

const product_controller = require('../controllers/product.controller');
/* GET shop page. */
router.get('/allproducts', function (req, res, next) {
    var successMgs = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('admin/products/allproducts', { title: 'View All Products', products: productChunks, successMgs: successMgs, noMessage: !successMgs, layout: false  });
    });
});


router.get('/createproduct', function (req, res) {
    console.log("create");
    res.render('admin/products/createproduct', { title: 'Create product', layout: false  });
});

router.post('/product/create', product_controller.product_create);
router.get('/product/:id', product_controller.product_details);
//update product
router.put('/product/:id/update', product_controller.product_update);
//delete product
router.delete('/product/:id/delete', product_controller.product_delete);
// a simple test url to check that all of our files are communicating correctly.
router.get('/test', product_controller.test);


//blogs

var Blog = require("../models/blog.model");
const blog_controller = require('../controllers/blog.controller');
router.get('/allblogs', function (req, res, next) {
    Blog.find(function (err, docs) {
        var blogPosts = [];
        var postSize = 1;
        for (var i = 0; i < docs.length; i += postSize) {
            blogPosts.push(docs.slice(i, i + postSize));
        }
        res.render('admin/blogs/allblogs', { title: 'Blog', blogs: blogPosts, layout: false });
    });
});


router.get('/createblog', function (req, res) {
    res.render('admin/blogs/createblog', { title: 'Create blog', layout: false   });
});


router.post('/blog/create', blog_controller.blog_create);
router.get('/blog/:id', blog_controller.blog_details);
//update product
router.put('/blog/:id/update', blog_controller.blog_update);
//delete product
router.delete('/blog/:id/delete', blog_controller.blog_delete);
// a simple test url to check that all of our files are communicating correctly.
router.get('/test', blog_controller.test);


//contact
router.get('/allcontacts', function (req, res, next) {
    var successMgs = req.flash('success')[0];
    Contact.find(function (err, docs) {
        var contactChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            contactChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('admin/contacts/allcontacts', { title: 'All contacts', contacts: contactChunks, successMgs: successMgs, noMessage: !successMgs, layout: false  });
    });
});

const contact_controller = require('../controllers/contact.controller');
//might need in future
//router.post('/create', contact_controller.contact_create);
router.get('/contact/:id', contact_controller.contact_details);
//update product
router.put('/contact/:id/update', contact_controller.contact_update);
//delete product
router.delete('/contact/:id/delete', contact_controller.contact_delete);
// a simple test url to check that all of our files are communicating correctly.
router.get('/test', contact_controller.test);

// Calendar
const CalendarController = require('../controllers/admin/calendar.controller');
router.get('/calendar', CalendarController.index);
router.get('/calendar/:year', CalendarController.edit);
router.post('/calendar/:year', CalendarController.submitEdit);

module.exports = router;

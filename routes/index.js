var express = require('express');
var router = express.Router();
var Blog = require("../models/blog.model");

/* GET home page. */
router.get('/', function (req, res, next) {
    Blog.find(function (err, docs) {
        var blogPosts = [];
        var postSize = 1;
        for (var i = 0; i < 3; i += postSize) {
            blogPosts.push(docs.slice(i, i + postSize));
        }
        res.render('index', { title: 'Index', blogs: blogPosts });
    });

});

module.exports = router;

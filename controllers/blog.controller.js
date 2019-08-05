const Blog = require('../models/blog.model');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.blog_create = function (req, res) {
    let blog = new Blog(
        {
            imagePath: req.body.imagePath,
            title: req.body.title,
            author: req.body.author,
            content: req.body.content, 
            tag: req.body.tag
        }
    );

    blog.save(function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/admin/allblogs');
        }
    });
};
//write blog details controller
exports.blog_details = function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        if (err) return next(err);
        res.render('admin/blogs/editblog', { title: 'Edit blogs', blog: blog, layout: false });
    });
};

//update blog
exports.blog_update = function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, blog) {
        if (err) return next(err);
        res.redirect('/admin/allblogs');
    });
};

//delete blog
exports.blog_delete = function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.redirect('/admin/allblogs');
    });
};




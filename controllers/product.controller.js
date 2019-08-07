const Product = require('../models/product.model');
//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};
// controllers/products.js
exports.product_create = function (req, res, next) {
    let product = new Product(
        {
            imagePath: req.body.imagePath,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        }
    );

    product.save(function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/admin/allproducts');
        }
    });
};
//write product details controller - for edit
exports.product_details = function (req, res, next) {
    Product.findById(req.params.id, function (err, product) {
        if (err) return next(err);
        res.render('admin/products/editproduct', { title: 'Edit product', product: product, layout: false  });
    });
};

//update product
exports.product_update = function (req, res) {
    Product.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, product) {
        if (err) return next(err);
        res.redirect('/admin/allproducts');
    });
};
//delete product
exports.product_delete = function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.redirect('/admin/allproducts');
    });
};
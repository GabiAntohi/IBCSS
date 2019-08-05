const User = require('../models/user.model');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.user_create = function (req, res) {
    let user = new User(
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
    );
    user.save(function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('');
        }
    })
};
//not used, might come in handy in the future
exports.user_details = function (req, res) {
    console.log('in update id');
    User.findById(req.params.id, function (err, user) {
        if (err) return next(err);
        res.render('user/edituser', {title: 'Edit user', user: user });
    });
};


//update user
exports.user_update = function (req, res) {

    User.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, user) {
        if (err) return next(err);
        res.redirect('/user/profile');
    });
};


//delete user
exports.user_delete = function (req, res) {
    console.log('in delete id');
    User.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.redirect('/user/viewusers');
    });
};



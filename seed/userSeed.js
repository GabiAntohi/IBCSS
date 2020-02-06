var User = require("../models/user.model");
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
mongoose.connect("mongodb://localhost:27017/ibcss");

var users = [
    new User({
        name: 'admin',
        email: 'admin@com.localhost',
        password: bcrypt.hashSync("admin", bcrypt.genSaltSync(5), null),
        isAdmin: true,
    })
];

var done = 0;
for (var i = 0; i < users.length; i++) {
    users[i].save(function (err, result) {
        done++;
        if (done === users.length) {
            exit();
        }
    });
}


function exit() {
    mongoose.disconnect();

}

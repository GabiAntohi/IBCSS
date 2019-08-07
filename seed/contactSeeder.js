var Contact = require("../models/contact.model");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ibcss");

var contacts= [
    new Contact({
        name:
            'Alex',
        surname: 'Vincent',
        email:
            'alexvincent@gmail.com',
        message: "helllo theeeere",

    }),
    new Contact({
        name:
            'Alex',
        surname: 'Vincent',
        email:
            'alexvincent@gmail.com',
        message: "helllo theeeere"
    }),
    new Contact({
        name:
            'Alex',
        surname: 'Vincent',
        email:
            'alexvincent@gmail.com',
        message: "helllo theeeere"
    }),
    new Contact({
        name:
            'Alex',
        surname: 'Vincent',
        email:
            'alexvincent@gmail.com',
        message: "helllo theeeere"
    }),
    new Contact({
        name:
            'Alex',
        surname: 'Vincent',
        email:
            'alexvincent@gmail.com',
        message: "helllo theeeere"
    })
];

var done = 0;
for (var i = 0; i < contacts.length; i++) {
    contacts[i].save(function (err, result) {
        done++;
        if (done === contacts.length) {
            exit();
        }
    });
}


function exit() {
    mongoose.disconnect();

}

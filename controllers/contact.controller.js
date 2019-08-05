const Contact = require('../models/contact.model');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.contact_create = function (req, res) {
    let contact = new Contact(
        {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            message: req.body.message
        }
    );
    contact.save(function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/contact');
        }
    });
};
//write contact details controller
exports.contact_details = function (req, res) {
    Contact.findById(req.params.id, function (err, contact) {
        if (err) return next(err);
        res.render('admin/contacts/editcontact', { title: 'Edit contacts', contact: contact, layout: false  });
    })
};

//update contact
exports.contact_update = function (req, res) {
    Contact.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, contact) {
        if (err) return next(err);
        res.redirect('/admin/allcontacts');
    });
};

//delete contact
exports.contact_delete = function (req, res) {
    Contact.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.redirect('/admin/allcontacts');
    })
};



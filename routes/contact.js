var express = require('express');
var router = express.Router();
var Contact = require("../models/contact.model");

/* GET contact page. */
router.get('/', function (req, res) {
    res.render('contact/createcontact', { title: 'Contact us' });
});




const contact_controller = require('../controllers/contact.controller');

router.post('/create', contact_controller.contact_create);

//router.get('/:id', contact_controller.contact_details);
// a simple test url to check that all of our files are communicating correctly.
router.get('/test', contact_controller.test);



module.exports = router;


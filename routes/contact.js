var express = require('express');
var router = express.Router();


/* GET contact page. */
router.get('/', function (req, res) {
    let displayForm = false;
    res.render('contact/createcontact', { title: 'Contact us', displayForm: displayForm });
});


const contact_controller = require('../controllers/contact.controller');

router.post('/create', contact_controller.contact_create);

//router.get('/:id', contact_controller.contact_details);
// a simple test url to check that all of our files are communicating correctly.
router.get('/test', contact_controller.test);

module.exports = router;


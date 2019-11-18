const express = require('express');
const HomeController = require("../controllers/home.controller");
let router = express.Router();

/* GET home page. */
router.get('/', HomeController.index);

module.exports = router;

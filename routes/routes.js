// routes/routes.js
var mongoose = require('mongoose');
var config = require('../config/database');
var User = require("../models/user");
const controller = require('../controllers/controller')
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res
        .status(200)
        .send({success: true, message: 'Mail Bot - Grupo 3'})
})

router.post("/", controller.saveData);

/* ------------
POST /token
---------------
body = {
  mail: a@a.com,
  token: "dad7asciha7..."
}
--------------- */
router.get('/token', function (req, res, next) {
	if (!req.body.mail || !req.body.token) {
		res.json({ success: false, msg: 'Please pass mail and token.' });
	} else {
		var newUser = new User({
			mail: req.body.mail,
			token: req.body.token
		});
		// save the user
		newUser.save(function (err) {
			if (err) {
				return res.json({ success: false, msg: 'Mail already exists.' });
			}
			res.json({ success: true, msg: 'Successful associated mail to token.' });
		});
	}
	 
});

module.exports = router;
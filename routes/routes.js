// Migrated credentials to environment variables
// var config = require('../config/database');
var User = require("../models/user");
var controller = require('../controllers/controller')
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res
    .status(200)
    .send({
      success: true,
      message: 'Mail Bot - Grupo 3'
    })
})

router.post("/", controller.backupRequest);

/* ------------
POST /token
---------------
body = {
  mail: a@a.com,
  token: "dad7asciha7..."
}
--------------- */
router.post('/token', controller.associateToken);

module.exports = router;
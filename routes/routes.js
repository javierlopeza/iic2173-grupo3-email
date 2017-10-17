var User = require("../models/user");
var controller = require('../controllers/controller')
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res
    .status(200)
    .send({
      success: true,
      message: 'Mail Bot - Grupo 3'
    })
})

router.post("/", controller.backupRequest);

router.post('/token', controller.associateToken);

module.exports = router;
// routes/routes.js

const controller = require('../controllers/controller')

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res
        .status(200)
        .send({success: true, message: 'Mail Bot - Grupo 3'})
})

router.post("/", controller.addToRedisQueue);

module.exports = router;
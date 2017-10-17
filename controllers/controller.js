// controllers/controller.js

const redis = require('../config/redis'),
  mongoose = require('mongoose'),
  User = require('../models/user'),
  requestSender = require('../lib/requestSender'),
  emailSender = require('../lib/emailSender'),
  redisRequestList = 'Requests',
  redisEmailList = 'Emails'

// Add input to Redis Queue
exports.backupRequest = (req, res) => {
  const input = req.body

  // Push into redis queue
  redis.lpush(redisRequestList, JSON.stringify(input), (err) => {
    if (err)
      console.log(`Error performing LPUSH on Redis: ${err}`)
    // Send success message
    res.status(200).send({
      success: true,
      message: 'OK',
      value: input
    })
  })
}

exports.addToRedisQueue = function (data) {
  let status, parsedData, token;
  redis.lpush(redisEmailList, JSON.stringify(data), (err, reply) => {
    if (err) {
      status = `Error performing LPUSH on Redis ${redisRequestList} list: ${err}`
    } else {
      status = `Redis LPUSH to ${redisEmailList} list succeed`
    }
    console.log(status)
  })
  redis.lpop(redisEmailList, function (err, datum) {
    if (err) {
      console.log(err)
    } else {
      parsedData = JSON.parse(datum)
      console.log(parsedData)

    }
  })
  requestSender.signIn({
      username: "demo@mail.com",
      password: "123123"
    }).then((resp) => {
      token = resp.token
      // requestSender.getAllProducts(token)
      let productRequests = parsedData.items['producto'].map(function (product) {
        return requestSender.getProductById(token, product)
      })
      let subject = `RE: ${parsedData.subject}` 
      let receiverAddress = parsedData.from[0].address
      let receiverName = parsedData.from[0].name || receiverAddress
      Promise.all(productRequests).then(values => {
          emailSender.sendEmail(receiverAddress, receiverName, subject, values).then((resp) => {
              console.log("Successfully sent response: " + resp)
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch(function (err) {
      console.log(err)
    })
  return 
}

exports.associateToken = function (req, res) {
  console.log('received')
  if (!req.body.mail || !req.body.token) {
    res.json({
      success: false,
      msg: 'Please pass mail and token.'
    })
  } else {
    console.log('Im here')
    var newUser = new User({
      mail: req.body.mail,
      token: req.body.token
    })
    // save the user
    newUser.save(function (err) {
      if (err) {
        res.json({
          success: false,
          msg: 'Mail already exists.'
        })
        return
      }
      res.json({
        success: true,
        msg: 'Successfull associated mail to token.'
      })
    })
  }
}
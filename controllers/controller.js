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
  let status, parsedData;
  // redis.lpush(redisEmailList, JSON.stringify(data), (err, reply) => {
  //   if (err) {
  //     status = `Error performing LPUSH on Redis ${redisRequestList} list: ${err}`
  //   } else {
  //     status = `Redis LPUSH to ${redisEmailList} list succeed`
  //   }
  //   console.log(status)
  // })
  // redis.lpop(redisEmailList, function (err, datum) {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     parsedData = JSON.parse(datum)
  //     console.log(parsedData)
  //   }
  // })
  parsedData = data
  let receiverAddress = parsedData.from[0].address
  getUserToken(receiverAddress).then((token) => {
      if(!token) {
        console.log("NO TOKEN FOUND")
        return
      }
      console.log(`[VALID TOKEN] starting server requests`)
      let productsToBuy = parsedData.items['productsToBuy']
      console.log(`[PARAMETERS] Purchases: ${JSON.stringify(productsToBuy)}`)
      let productsToQuery = parsedData.items['productsToQuery']
      console.log(`[PARAMETERS] Queries: ${JSON.stringify(productsToQuery)}`)
      let productInformationRequests = productsToQuery.map(function (product) {
        return requestSender.getProductById(token, product)
      })
      let shoppingCart = {address: parsedData.items['address'], cart: productsToBuy}      
      console.log(`[BUILT BODY] Shopping cart: ${JSON.stringify(shoppingCart)}`)
      let productPurchaseRequest = []
      if(shoppingCart.address == "") { 
        productsToBuy = []
      } else {
        productPurchaseRequest = [requestSender.buyProducts(token, shoppingCart)]
      }
      let requestPromises = productPurchaseRequest.concat(productInformationRequests)     
      Promise.all(requestPromises).then(values => {
          let purchases = []
          let products = []
          if(productsToBuy.length != 0) {
            purchases = values[0]
            console.log(`[RESPONSES] Purchases: ${JSON.stringify(purchases)}`)
            if(productsToQuery.length != 0) {
              products = values.slice(1,)
              console.log(`[RESPONSES] Queries: ${JSON.stringify(products)}`)
            }
          } else {
            products = values
            console.log(`[RESPONSES] Queries: ${JSON.stringify(products)}`)
          }
          let info = { products, purchases }
          let subject = `RE: ${parsedData.subject}`
          let receiverName = parsedData.from[0].name || receiverAddress
          emailSender.sendEmail(receiverAddress, receiverName, subject, info).then(resp => {
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
        msg: 'Successful associated mail to token.'
      })
    })
  }
}

getUserToken = function (mail) {
  return new Promise(function (resolve, reject) {
    User.findOne({
      'mail': mail
    }, 'mail token', function (err, user) {
      if (err) {
        console.log(err)
        reject(null)
      } if (user) {
        // console.log(`${user.mail}: ${user.token}`)
        resolve(user.token)
      } else {
        console.log(`user with email ${mail} not found`)
        resolve("not found")
      }
    })
  })
}
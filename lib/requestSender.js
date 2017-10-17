var request = require('request')
var https = require('https')

function makeOptions(method, path, body = null, token = null) {
  let object = {
    hostname: process.env.SERVER_URL,
    path,
    method,
    json: true,
    headers: {
      'Content-Type': 'application/json',
    }
  }
  if (method == "POST") {
    object.headers['Content-Length'] = body.length
  } else if (method == "GET") {
    object.headers['Authorization'] = token
  }
  return object
}

function asyncRequest(options, body = null) {
  return new Promise(function (resolve, reject) {
    let req = https.request(options, (res) => {
      res.on('data', (d) => {
        if (res.statusCode == 200) {
          resolve(JSON.parse(d))
        } else(
          resolve(res.statusCode)
        )
      })
    }).on('error', (err) => {
      reject(err)
    })
    if (options.method == "POST") {
      req.write(body)
    }
    req.end()
  })
}

async function signIn(data) {
  let postBody = JSON.stringify(data)
  let options = makeOptions('POST', '/api/signin', postBody, null)
  let res = await asyncRequest(options, postBody)
  // console.log(res)
  return res
}

async function getAllProducts(token) {
  let options = makeOptions('GET', '/api/products', null, token)
  let res = await asyncRequest(options)
  // console.log(res)
  return res
}

async function getProductById(token, id) {
  let options = makeOptions('GET', `/api/product/${id}`, null, token)
  let res = await asyncRequest(options)
  // console.log(res)
  return res
}

async function getAllCategories(token) {
  let options = makeOptions('GET', '/api/categories', null, token)
  let res = await asyncRequest(options)
  // console.log(res)
  return res
}

module.exports = {
  signIn,
  getAllProducts,
  getProductById,
  getAllCategories
}
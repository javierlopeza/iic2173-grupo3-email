const nodemailer = require('nodemailer')
const sender = process.env.GMAIL_ACCOUNT
const password = process.env.GMAIL_PASSWORD

var transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: sender,
    pass: password
  }
})

// send mail with defined transport object
exports.sendEmail = function (receiver, name, subject, data) {

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: sender,
    to: receiver,
    subject: subject,
    text: "text",
    html: buildHTML({
      products: data.products,
      purchases: data.purchases,
      email: receiver,
      name
    })
  }

  return new Promise(function (resolve, reject) {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        console.log('Message sent: ' + info.response)
        resolve(info.response)
      }
    })
  })
}

function buildHTML(data) {
  if (!data) {
    return "<h1>Data Not Found</h1>"
  }
  let mainTitle = `<h1> Estimado ${data.name}, gracias por preferir a Arquitrán SPA</h1>`
  let productsTable = data.products.length > 0 ? createProductsTable(data.products) : ""
  let purchasesTable = data.purchases.length > 0 ? createPurchasesTable(data.purchases) : ""
  return mainTitle + productsTable + puchasesTable
}

function createProductsTable(purchases) {
  let productsTitle = '<p>Estos son los productos que usted consultó:</p>'
  let productsHeaders = `
  <tr>
    <th>ID</th>
    <th>Nombre</th> 
    <th>Precio</th>
    <th>Contexto</th>
    <th>Área</th>
    <th>Grupo</th>
  </tr>`
  let products = data.products.map((p) => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>${p.category.context}</td>
      <td>${p.category.area}</td>
      <td>${p.category.group}</td>
    </tr>`)
  let productsTableBody = products.reduce((prev, current) => {
    return prev + current
  })
  let productsTable = `<table>${productsHeaders}${productsTableBody}</table>`
  return productsTable
}

function createPurchasesTable(purchases) {
  let purchasesTitle = '<p>Estas son sus compras:</p>'
  let purchasesHeaders = `
  <tr>
    <th>ID</th>
    <th>Nombre</th> 
    <th>Precio</th>
    <th>Cantidad</th>
  </tr>`
  let purchases = data.purchases.map((p) => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>${p.quantity}</td>      
    </tr>`)
  let purchasesTableBody = purchases.reduce((prev, current) => {
    return prev + current
  })
  let purchasesTable = `<table>${purchasesHeaders}${purchasesTableBody}</table>`
  return purchasesTable
}